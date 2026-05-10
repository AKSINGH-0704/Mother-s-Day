'use strict';
// ── STATE ──────────────────────────────────────────────────────────────────
const state = {
  mode:'creator', relationship:'Mom', recipientName:'',
  balloons:[{message:'',imageData:null},{message:'',imageData:null}],
  finalMessage:'', audioData:null, audioFileName:'', audioUrl:null,
  shareData:null, poppedCount:0, totalBalloons:0,
  isMobile:window.innerWidth<=768,
  audioCtx:null, ambientGain:null, ambientNodes:[], personalAudio:null
};

// ── BACKGROUND PARTICLES ───────────────────────────────────────────────────
let bgCanvas,bgCtx,bgW,bgH;
const PARTS=[];
const EMOJIS=['🌸','🌷','🌹','🍃','✨','💛','🌺','🕊️'];
function initBg(){
  bgCanvas=document.getElementById('bg-canvas');
  bgCtx=bgCanvas.getContext('2d');
  resizeBg();
  window.addEventListener('resize',resizeBg);
  for(let i=0;i<(state.isMobile?18:36);i++)PARTS.push(mkPart(true));
  animBg();
}
function resizeBg(){bgW=bgCanvas.width=innerWidth;bgH=bgCanvas.height=innerHeight;}
function mkPart(rY){
  return{x:Math.random()*bgW,y:rY?Math.random()*bgH:bgH+40,z:Math.random()*800+100,
    vx:(Math.random()-.5)*.3,vy:-(Math.random()*.4+.1),vz:(Math.random()-.5)*.2,
    emoji:EMOJIS[Math.floor(Math.random()*EMOJIS.length)],
    op:Math.random()*.3+.1,rot:Math.random()*360,rs:(Math.random()-.5)*.5,
    wb:Math.random()*Math.PI*2,ws:Math.random()*.01+.005,
    bp:Math.random()*Math.PI*2,bs:Math.random()*.02+.01};
}
function animBg(){
  bgCtx.clearRect(0,0,bgW,bgH);
  const fl=600,cx=bgW/2,cy=bgH/2;
  for(let i=PARTS.length-1;i>=0;i--){
    const p=PARTS[i];
    p.wb+=p.ws;p.bp+=p.bs;
    p.x+=p.vx+Math.sin(p.wb)*.2;p.y+=p.vy;p.z+=p.vz;p.rot+=p.rs;
    if(p.z<10)p.z=900;if(p.z>1000)p.z=50;
    if(p.y<-60){PARTS[i]=mkPart(false);continue;}
    const sc=fl/(fl+p.z),sx=(p.x-cx)*sc+cx,sy=(p.y-cy)*sc+cy;
    const sz=Math.max(10,28*sc),al=Math.min((p.op+Math.sin(p.bp)*.1)*sc,.75);
    bgCtx.save();bgCtx.globalAlpha=al;bgCtx.font=`${sz}px serif`;
    bgCtx.translate(sx,sy);bgCtx.rotate(p.rot*Math.PI/180);
    bgCtx.fillText(p.emoji,-sz/2,sz/3);bgCtx.restore();
  }
  requestAnimationFrame(animBg);
}

// ── SCREENS ────────────────────────────────────────────────────────────────
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>{s.classList.add('hidden');s.classList.remove('active');});
  const el=document.getElementById(id);
  if(!el)return;
  el.classList.remove('hidden');
  requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('active')));
  window.scrollTo({top:0,behavior:'smooth'});
}

// ── AUDIO ENGINE ───────────────────────────────────────────────────────────
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){
    if(state.audioCtx)state.audioCtx.suspend();
    if(state.personalAudio)state.personalAudio.pause();
  } else {
    if(state.audioCtx&&state.mode==='recipient')state.audioCtx.resume();
    if(state.personalAudio&&state.poppedCount>0)state.personalAudio.play().catch(()=>{});
  }
});
function ensureCtx(){
  if(!state.audioCtx)state.audioCtx=new(window.AudioContext||window.webkitAudioContext)();
  if(state.audioCtx.state==='suspended')state.audioCtx.resume();
}
function buildReverb(ctx){
  const conv=ctx.createConvolver(),len=ctx.sampleRate*2,buf=ctx.createBuffer(2,len,ctx.sampleRate);
  for(let c=0;c<2;c++){const d=buf.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3);}
  conv.buffer=buf;return conv;
}
function startAmbientAudio(){
  try{
    ensureCtx();const ctx=state.audioCtx;
    const master=ctx.createGain();
    master.gain.setValueAtTime(0,ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.06,ctx.currentTime+3);
    state.ambientGain=master;
    const rev=buildReverb(ctx);master.connect(rev);rev.connect(ctx.destination);master.connect(ctx.destination);
    [196,261.63,329.63,392].forEach(f=>{
      const osc=ctx.createOscillator(),g=ctx.createGain();
      osc.type='sine';osc.frequency.value=f;g.gain.value=0.2;
      osc.connect(g);g.connect(master);osc.start();state.ambientNodes.push(osc);
    });
  }catch(e){}
}
function fadeOutAmbient(){
  if(!state.ambientGain||!state.audioCtx)return;
  state.ambientGain.gain.linearRampToValueAtTime(0,state.audioCtx.currentTime+3);
  setTimeout(()=>state.ambientNodes.forEach(n=>{try{n.stop();}catch(e){}}),3500);
}
function playSoftChime(){
  try{
    ensureCtx();const ctx=state.audioCtx,t=ctx.currentTime;
    const osc=ctx.createOscillator(),g=ctx.createGain();
    osc.type='sine';osc.frequency.setValueAtTime(880,t);osc.frequency.exponentialRampToValueAtTime(1320,t+.15);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.04,t+.05);g.gain.exponentialRampToValueAtTime(.001,t+.9);
    osc.connect(g);g.connect(ctx.destination);osc.start(t);osc.stop(t+1);
  }catch(e){}
}
function startPersonalAudio(){
  if(!state.personalAudio||!state.audioReady)return;
  fadeOutAmbient();
  state.personalAudio.loop=true;
  state.personalAudio.currentTime=0;
  // volume starts at 0, fade in
  state.personalAudio.volume=0;
  const playPromise=state.personalAudio.play();
  if(playPromise!==undefined){
    playPromise.then(()=>{
      let v=0;
      const iv=setInterval(()=>{v=Math.min(v+.04,.85);state.personalAudio.volume=v;if(v>=.85)clearInterval(iv);},120);
    }).catch(err=>{
      // Autoplay blocked — attach a one-time click handler on the entire page to retry
      console.warn('Autoplay blocked, will retry on next tap:',err.name);
      const retry=()=>{
        state.personalAudio.play().then(()=>{
          let v=0;
          const iv=setInterval(()=>{v=Math.min(v+.04,.85);state.personalAudio.volume=v;if(v>=.85)clearInterval(iv);},120);
        }).catch(()=>{});
        document.removeEventListener('click',retry);
        document.removeEventListener('touchstart',retry);
      };
      document.addEventListener('click',retry,{once:true});
      document.addEventListener('touchstart',retry,{once:true});
    });
  }
}
function stopAllAudio(){
  if(state.ambientGain)state.ambientGain.gain.value=0;
  state.ambientNodes.forEach(n=>{try{n.stop();}catch(e){}});
  state.ambientNodes=[];
  if(state.personalAudio){state.personalAudio.pause();state.personalAudio.currentTime=0;}
}

// ── LINK UTILITIES ─────────────────────────────────────────────────────────
function buildInlineLink(data){
  const compressed=LZString.compressToEncodedURIComponent(JSON.stringify(data));
  return`${location.origin}${location.pathname}?d=${compressed}`;
}
function decodeInlineLink(param){
  try{return JSON.parse(LZString.decompressFromEncodedURIComponent(param));}catch(e){return null;}
}
function wireShareButtons(link){
  const copy=document.getElementById('btn-copy-link');
  const wa=document.getElementById('btn-whatsapp-share');
  const native=document.getElementById('btn-native-share');
  if(copy)copy.onclick=()=>navigator.clipboard.writeText(link).then(()=>{
    copy.textContent='✅ Copied!';
    setTimeout(()=>{copy.innerHTML='📋 Copy Link';},2500);
  });
  if(wa)wa.onclick=()=>window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("A Mother's Day surprise for you 🌸\n"+link)}`);
  if(native){
    if(navigator.share)native.onclick=()=>navigator.share({title:"Mother's Day Surprise",url:link});
    else native.style.display='none';
  }
}

// ── CREATOR: INTRO ─────────────────────────────────────────────────────────
function initIntroScreen(){
  document.getElementById('btn-intro-continue').onclick=()=>showScreen('screen-setup');
}

// ── CREATOR: SETUP ─────────────────────────────────────────────────────────
function initSetupScreen(){
  document.querySelectorAll('.rel-card').forEach(card=>{
    card.addEventListener('click',()=>{
      document.querySelectorAll('.rel-card').forEach(c=>c.classList.remove('selected'));
      card.classList.add('selected');
      state.relationship=card.dataset.rel;
    });
  });
  document.getElementById('btn-setup-back').onclick=()=>showScreen('screen-intro');
  document.getElementById('btn-setup-continue').onclick=()=>{
    state.recipientName=document.getElementById('recipient-name').value.trim();
    renderMemoryCards();
    showScreen('screen-balloons');
  };
}

// ── CREATOR: MEMORY CARDS ──────────────────────────────────────────────────
function renderMemoryCards(){
  const list=document.getElementById('balloon-cards-list');
  list.innerHTML='';
  state.balloons.forEach((b,i)=>{
    const div=document.createElement('div');
    div.className='balloon-card card';
    div.innerHTML=`
      <div class="balloon-card-header">
        <div class="balloon-card-num">Memory ${i+1}</div>
        ${state.balloons.length>2?`<button class="remove-balloon-btn" data-idx="${i}">&times;</button>`:''}
      </div>
      <div class="form-group">
        <label class="form-label">Her Memory:</label>
        <textarea class="form-textarea" maxlength="200" placeholder="A memory, a thank you, something she always says...">${b.message}</textarea>
        <span class="char-count">${b.message.length}/200</span>
      </div>
      <div class="form-group" style="margin-top:0.5rem">
        <label class="form-label">Memory Photo <span class="optional">(Optional)</span></label>
        <div class="image-upload-area">
          <label class="upload-btn">Choose Photo<input type="file" accept="image/*" style="display:none"></label>
          ${b.imageData?`<img src="${b.imageData}" class="image-preview-thumb"><button class="remove-balloon-btn remove-img-btn">&times; Remove</button>`:''}
        </div>
      </div>`;
    list.appendChild(div);
    const ta=div.querySelector('textarea'),cc=div.querySelector('.char-count');
    ta.oninput=()=>{b.message=ta.value;cc.textContent=`${ta.value.length}/200`;};
    div.querySelector('input[type=file]').onchange=async e=>{
      const file=e.target.files[0];
      if(!file)return;
      if(file.size>10*1024*1024){alert('Image too large. Max 10MB.');return;}
      b.imageData=await compressImage(file);
      renderMemoryCards();
    };
    const rmv=div.querySelector('[data-idx]');
    if(rmv)rmv.onclick=()=>{state.balloons.splice(i,1);renderMemoryCards();};
    const rmvImg=div.querySelector('.remove-img-btn');
    if(rmvImg)rmvImg.onclick=()=>{b.imageData=null;renderMemoryCards();};
  });
}

async function compressImage(file){
  return new Promise(resolve=>{
    const reader=new FileReader();
    reader.onload=e=>{
      const img=new Image();
      img.onload=()=>{
        const MAX=800;let w=img.width,h=img.height;
        if(w>h){if(w>MAX){h=h*MAX/w;w=MAX;}}else{if(h>MAX){w=w*MAX/h;h=MAX;}}
        const c=document.createElement('canvas');
        c.width=Math.round(w);c.height=Math.round(h);
        c.getContext('2d').drawImage(img,0,0,c.width,c.height);
        resolve(c.toDataURL('image/jpeg',0.72));
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function initBalloonsScreen(){
  // Wire audio upload card (on this screen)
  const audioInput=document.getElementById('audio-file-input');
  const audioInfo=document.getElementById('audio-selected-info');
  const audioName=document.getElementById('audio-file-name');
  if(audioInput){
    if(state.audioFileName){audioInfo.classList.remove('hidden');if(audioName)audioName.textContent='🎵 '+state.audioFileName;}
    audioInput.onchange=e=>{
      const file=e.target.files[0];
      if(!file)return;
      if(file.size>20*1024*1024){alert('Audio too large. Max 20MB.');return;}
      const reader=new FileReader();
      reader.onload=ev=>{
        state.audioData=ev.target.result;
        state.audioFileName=file.name;
        state.audioUrl=null;
        audioInfo.classList.remove('hidden');
        if(audioName)audioName.textContent='🎵 '+file.name;
      };
      reader.readAsDataURL(file);
    };
    const rmvAudio=document.getElementById('btn-remove-audio');
    if(rmvAudio)rmvAudio.onclick=()=>{
      state.audioData=null;state.audioFileName='';state.audioUrl=null;
      audioInfo.classList.add('hidden');audioInput.value='';
    };
  }
  document.getElementById('btn-balloons-back').onclick=()=>showScreen('screen-setup');
  document.getElementById('btn-add-balloon').onclick=()=>{
    if(state.balloons.length>=9)return;
    state.balloons.push({message:'',imageData:null});
    renderMemoryCards();
  };
  document.getElementById('btn-balloons-continue').onclick=()=>{
    const valid=state.balloons.filter(b=>b.message.trim());
    if(valid.length<2){
      const btn=document.getElementById('btn-balloons-continue');
      const orig=btn.innerHTML;
      btn.textContent='Add at least 2 memories 🌸';
      setTimeout(()=>{btn.innerHTML=orig;},2500);
      return;
    }
    document.getElementById('final-message').value=state.finalMessage;
    document.getElementById('message-count').textContent=`${state.finalMessage.length}/800`;
    showScreen('screen-message');
  };
}

// ── CREATOR: MESSAGE ───────────────────────────────────────────────────────
function initMessageScreen(){
  const ta=document.getElementById('final-message');
  const cc=document.getElementById('message-count');
  ta.oninput=()=>cc.textContent=`${ta.value.length}/800`;
  document.getElementById('btn-message-back').onclick=()=>{state.finalMessage=ta.value.trim();showScreen('screen-balloons');};
  document.getElementById('btn-message-preview').onclick=()=>{state.finalMessage=ta.value.trim();showScreen('screen-deploy');initDeployScreen();};
}

// ── CREATOR: DEPLOY ────────────────────────────────────────────────────────
function initDeployScreen(){
  document.getElementById('btn-deploy-back').onclick=()=>showScreen('screen-message');

  state.shareData={
    relationship:state.relationship,
    name:state.recipientName,
    balloons:state.balloons.filter(b=>b.message.trim()).map(b=>({message:b.message,imageUrl:b.imageData||null})),
    finalMessage:state.finalMessage,
    audioUrl:state.audioUrl||null
  };

  document.getElementById('btn-deploy-preview').onclick=()=>{
    document.getElementById('preview-banner').classList.remove('hidden');
    if(state.audioData&&!state.shareData.audioUrl){
      const audio=new Audio(state.audioData);audio.loop=true;
      state.personalAudio=audio;
      state.audioReady=true;
    }
    beginRecipientFlow(state.shareData);
  };

  const linkInput=document.getElementById('share-link');
  linkInput.value='Generating your link…';
  generateShareLink(linkInput);
}

async function generateShareLink(linkInput){
  const note=document.getElementById('share-note');
  const setNote=(msg,err)=>{if(!note)return;note.textContent=msg;note.style.color=err?'#b55':'rgba(100,70,80,0.7)';note.style.display=msg?'block':'none';};
  setNote('');

  // ── Step 1: Try cloud (Blob + KV) ───────────────────────────────────
  let cloudLink=null;
  try{
    for(const b of state.shareData.balloons){
      if(b.imageUrl&&b.imageUrl.startsWith('data:')){
        try{
          const r=await fetch('/api/upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({imageBase64:b.imageUrl})});
          if(r.ok)b.imageUrl=(await r.json()).url;
        }catch(e){}
      }
    }
    if(state.audioData&&!state.audioUrl){
      try{
        linkInput.value='Uploading your audio…';
        const r=await fetch('/api/upload-audio',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({audioBase64:state.audioData})});
        if(r.ok){state.audioUrl=(await r.json()).url;state.shareData.audioUrl=state.audioUrl;}
      }catch(e){}
    }
    linkInput.value='Saving your surprise…';
    const resp=await fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state.shareData)});
    if(resp.ok){const{id}=await resp.json();cloudLink=`${location.origin}${location.pathname}?s=${id}`;}
  }catch(e){}

  if(cloudLink){
    linkInput.value=cloudLink;wireShareButtons(cloudLink);
    setNote('Saved to cloud — photos & audio included ✓');
    return;
  }

  // ── Step 2: Inline LZ-String fallback — TEXT ONLY, no base64 images ─
  linkInput.value='Building your link…';
  try{
    const payload={
      relationship:state.shareData.relationship,
      name:state.shareData.name,
      finalMessage:state.shareData.finalMessage,
      audioUrl:state.audioUrl||null,
      // NEVER include base64 images — only already-hosted https:// URLs
      balloons:state.shareData.balloons.map(b=>({
        message:b.message,
        imageUrl:(b.imageUrl&&b.imageUrl.startsWith('https://'))?b.imageUrl:null
      }))
    };
    const compressed=LZString.compressToEncodedURIComponent(JSON.stringify(payload));
    const inlineLink=`${location.origin}${location.pathname}?d=${compressed}`;

    if(inlineLink.length>7500){
      linkInput.value='Link too large. Check your connection and retry.';
      setNote('⚠️ Cloud save failed and data is too large for a URL. Check internet connection.',true);
      return;
    }

    linkInput.value=inlineLink;
    wireShareButtons(inlineLink);

    const hadLocalImages=state.shareData.balloons.some(b=>b.imageUrl&&b.imageUrl.startsWith('data:'));
    setNote(hadLocalImages
      ?'⚠️ Photos could not be included (cloud unavailable). Your memories & message are preserved.'
      :'Link ready — share away! 🌸');
  }catch(e){
    linkInput.value='Could not generate link. Please check your connection.';
  }
}

// ── RECIPIENT: URL CHECK ───────────────────────────────────────────────────
async function checkUrl(){
  const params=new URLSearchParams(location.search);
  const id=params.get('s');
  const inlineParam=params.get('d');

  if(id||inlineParam){
    state.mode='recipient';
    document.getElementById('loading-overlay').classList.remove('hidden');
    document.getElementById('screen-intro').classList.add('hidden');

    if(inlineParam){
      const data=decodeInlineLink(inlineParam);
      if(data&&data.balloons){beginRecipientFlow(data);}
      else showLoadError();
    } else {
      try{
        const resp=await fetch('/api/load?id='+id);
        if(!resp.ok)throw new Error('not found');
        beginRecipientFlow(await resp.json());
      }catch{showLoadError();}
    }
  } else {
    initIntroScreen();
    initSetupScreen();
    renderMemoryCards();
    initBalloonsScreen();
    initMessageScreen();
    document.getElementById('btn-edit-surprise').onclick=()=>{
      document.getElementById('preview-banner').classList.add('hidden');
      stopAllAudio();
      showScreen('screen-deploy');
    };
  }
}
function showLoadError(){
  document.querySelector('.loading-bloom').textContent='🥀';
  document.querySelector('.loading-text').textContent="This surprise couldn't be found.";
  const e=document.getElementById('loading-error');
  if(e)e.textContent='The link may have expired or is incorrect.';
}

// ── RECIPIENT: BEGIN FLOW ──────────────────────────────────────────────────
async function beginRecipientFlow(data){
  const balloons=(data.balloons||[]).map(b=>({
    message:(b.message||'').trim(),
    imageUrl:b.imageUrl||b.imageData||null
  })).filter(b=>b.message);

  state.shareData={...data,balloons};
  state.poppedCount=0;
  state.totalBalloons=balloons.length;
  document.getElementById('welcome-name').textContent=data.name||data.relationship||'Mom';

  if(data.audioUrl&&!state.personalAudio){
    state.audioReady=false;
    const audio=new Audio();
    audio.loop=true;
    audio.preload='auto';

    // Load with CORS first; if that errors, retry without
    const loadAudio=(useCors)=>new Promise(res=>{
      audio.oncanplaythrough=()=>{state.audioReady=true;res();};
      audio.onerror=()=>{
        if(useCors){
          // strip crossOrigin and retry without CORS
          audio.crossOrigin=null;
          audio.load();
          loadAudio(false).then(res);
        } else {
          console.warn('Audio failed to load from URL:',data.audioUrl);
          res(); // continue without audio
        }
      };
      setTimeout(()=>res(),4000); // 4-second failsafe
      if(useCors) audio.crossOrigin='anonymous';
      audio.src=data.audioUrl;
      audio.load();
    });

    state.personalAudio=audio;
    await loadAudio(true);
  } else {
    state.audioReady=!!(state.personalAudio); // preview mode: audio already set
  }

  const imgLoads=balloons.filter(b=>b.imageUrl).map(b=>new Promise(res=>{const i=new Image();i.onload=res;i.onerror=res;i.src=b.imageUrl;}));
  await Promise.all(imgLoads);

  document.getElementById('loading-overlay').classList.add('hidden');
  showScreen('screen-welcome');
  document.getElementById('btn-start-magic').onclick=()=>{startAmbientAudio();renderBloomsStage();showScreen('screen-pop');};
}

// ── RECIPIENT: BLOOMS ──────────────────────────────────────────────────────
function renderBloomsStage(){
  const stage=document.getElementById('balloons-stage');
  stage.innerHTML='';
  const blooms=state.shareData.balloons;
  blooms.forEach((b,i)=>{
    const el=document.createElement('div');
    el.className='balloon-item';
    const isLast=i===blooms.length-1;
    el.innerHTML='<span class="bloom-icon">🌸</span>';
    el.style.left=`${10+Math.random()*75}%`;
    el.style.top=`${15+Math.random()*60}%`;
    el.style.animationDelay=`${Math.random()*2}s`;
    if(isLast)el.classList.add('locked');
    el.onclick=()=>{
      if(el.classList.contains('locked')||el.dataset.popped)return;
      el.dataset.popped='1';
      el.style.transform='scale(1.4)';el.style.opacity='0';el.style.pointerEvents='none';
      state.poppedCount++;
      if(state.poppedCount===1)startPersonalAudio();
      playSoftChime();
      setTimeout(()=>{showBloomModal(b,isLast);updateCounter();},400);
    };
    stage.appendChild(el);
  });
  updateCounter();
}

function updateCounter(){
  const rem=state.totalBalloons-state.poppedCount;
  const el=document.getElementById('pop-counter');
  if(!el)return;
  if(rem===1){
    el.textContent='One final memory remains.';
    const last=document.querySelector('.balloon-item.locked');
    if(last){last.classList.remove('locked');last.classList.add('locked-glow');}
  } else if(rem<=0){
    el.textContent='';
  } else {
    el.textContent=`Take your time. ${rem} memories remaining.`;
  }
}

function showBloomModal(bloom,isLast){
  const modal=document.getElementById('balloon-modal');
  const msgEl=document.getElementById('reveal-balloon-msg');
  const photo=document.getElementById('reveal-photo-area');
  const btn=document.getElementById('btn-modal-next');
  const line=document.getElementById('reveal-underline');
  msgEl.textContent='';photo.innerHTML='';
  btn.classList.add('hidden');line.classList.add('hidden');line.style.width='0';
  if(bloom.imageUrl)photo.innerHTML=`<img src="${bloom.imageUrl}">`;
  modal.classList.remove('hidden');
  requestAnimationFrame(()=>requestAnimationFrame(()=>modal.classList.add('active')));
  let idx=0;const text=bloom.message;
  const iv=setInterval(()=>{
    msgEl.textContent+=text[idx++];
    if(idx>=text.length){
      clearInterval(iv);
      line.classList.remove('hidden');
      setTimeout(()=>line.style.width='60px',80);
      setTimeout(()=>btn.classList.remove('hidden'),450);
    }
  },42);
  btn.onclick=()=>{
    modal.classList.remove('active');
    setTimeout(()=>modal.classList.add('hidden'),800);
    if(isLast)setTimeout(showFinalReveal,1000);
  };
}

function showFinalReveal(){
  const data=state.shareData;
  document.getElementById('reveal-name').textContent=data.name||data.relationship||'Mom';
  document.getElementById('reveal-text').textContent=data.finalMessage||'';
  PARTS.forEach(p=>{p.vx*=.3;p.vy*=.3;p.ws*=.5;});
  showScreen('screen-reveal');
}

// ── BOOT ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{initBg();checkUrl();});
