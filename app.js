'use strict';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
const state = {
  mode: 'creator',
  relationship: 'Mom',
  recipientName: '',
  balloons: [
    { message: '', imageData: null },
    { message: '', imageData: null }
  ],
  finalMessage: '',
  shareData: null,
  poppedCount: 0,
  totalBalloons: 0,
  isMobile: window.innerWidth <= 768,
  audioCtx: null,
  ambientGain: null,
  ambientNodes: [],
  personalAudio: null,
};

// ─────────────────────────────────────────────
// BACKGROUND
// ─────────────────────────────────────────────
let bgCanvas, bgCtx, bgW, bgH;
const PARTS = [];
const EMOJIS = ['🌸','🌷','🌹','🍃','✨','💛','🌺','🕊️'];

function initBg() {
  bgCanvas = document.getElementById('bg-canvas');
  bgCtx = bgCanvas.getContext('2d');
  resizeBg();
  window.addEventListener('resize', resizeBg);
  for (let i = 0; i < (state.isMobile ? 18 : 36); i++) PARTS.push(mkPart(true));
  animBg();
}

function resizeBg() { bgW = bgCanvas.width = innerWidth; bgH = bgCanvas.height = innerHeight; }

function mkPart(rY) {
  return {
    x: Math.random() * bgW, y: rY ? Math.random() * bgH : bgH + 40,
    z: Math.random() * 800 + 100,
    vx: (Math.random() - .5) * .3, vy: -(Math.random() * .4 + .1), vz: (Math.random() - .5) * .2,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    op: Math.random() * .3 + .1, rot: Math.random() * 360, rs: (Math.random() - .5) * .5,
    wb: Math.random() * Math.PI * 2, ws: Math.random() * .01 + .005,
    bp: Math.random() * Math.PI * 2, bs: Math.random() * .02 + .01
  };
}

function animBg() {
  bgCtx.clearRect(0, 0, bgW, bgH);
  const fl = 600, cx = bgW / 2, cy = bgH / 2;
  for (let i = PARTS.length - 1; i >= 0; i--) {
    const p = PARTS[i];
    p.wb += p.ws; p.bp += p.bs;
    p.x += p.vx + Math.sin(p.wb) * .2; p.y += p.vy; p.z += p.vz; p.rot += p.rs;
    if (p.z < 10) p.z = 900; if (p.z > 1000) p.z = 50;
    if (p.y < -60) { PARTS[i] = mkPart(false); continue; }
    const sc = fl / (fl + p.z);
    const sx = (p.x - cx) * sc + cx, sy = (p.y - cy) * sc + cy;
    const sz = Math.max(10, 28 * sc);
    const al = Math.min((p.op + Math.sin(p.bp) * .1) * sc, .75);
    bgCtx.save(); bgCtx.globalAlpha = al; bgCtx.font = `${sz}px serif`;
    bgCtx.translate(sx, sy); bgCtx.rotate(p.rot * Math.PI / 180);
    bgCtx.fillText(p.emoji, -sz / 2, sz / 3); bgCtx.restore();
  }
  requestAnimationFrame(animBg);
}

// ─────────────────────────────────────────────
// SCREEN TRANSITIONS
// ─────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.add('hidden');
    s.classList.remove('active');
  });
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('active')));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─────────────────────────────────────────────
// AUDIO SYSTEM
// ─────────────────────────────────────────────
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (state.audioCtx) state.audioCtx.suspend();
    if (state.personalAudio) state.personalAudio.pause();
  } else {
    if (state.audioCtx && state.mode === 'recipient') state.audioCtx.resume();
  }
});

function ensureAudioCtx() {
  if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
}

function buildReverb(ctx) {
  const conv = ctx.createConvolver();
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  }
  conv.buffer = buf;
  return conv;
}

function startAmbientAudio() {
  try {
    ensureAudioCtx();
    const ctx = state.audioCtx;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 3);
    state.ambientGain = master;
    const rev = buildReverb(ctx);
    master.connect(rev); rev.connect(ctx.destination);
    master.connect(ctx.destination);
    [196.00, 261.63, 329.63, 392.00].forEach(f => {
      const osc = ctx.createOscillator();
      osc.type = 'sine'; osc.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = 0.2;
      osc.connect(g); g.connect(master); osc.start();
      state.ambientNodes.push(osc);
    });
  } catch(e) { /* graceful fail */ }
}

function evolveAmbientAudio() {
  if (!state.ambientGain || !state.audioCtx) return;
  const progress = state.poppedCount / Math.max(state.totalBalloons, 1);
  const vol = 0.07 + progress * 0.1;
  state.ambientGain.gain.linearRampToValueAtTime(vol, state.audioCtx.currentTime + 2);
}

function playSoftChime() {
  try {
    ensureAudioCtx();
    const ctx = state.audioCtx, t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.15);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t + 1);
  } catch(e) { /* graceful fail */ }
}

function startPersonalAudio() {
  // Fade out ambient
  if (state.ambientGain && state.audioCtx) {
    state.ambientGain.gain.linearRampToValueAtTime(0, state.audioCtx.currentTime + 4);
    setTimeout(() => state.ambientNodes.forEach(n => { try { n.stop(); } catch(e){} }), 4500);
  }
  // Fade in personal audio
  if (state.personalAudio) {
    state.personalAudio.volume = 0;
    state.personalAudio.play().catch(() => {});
    let v = 0;
    const iv = setInterval(() => {
      v = Math.min(v + 0.05, 1);
      state.personalAudio.volume = v;
      if (v >= 1) clearInterval(iv);
    }, 100);
  }
}

function stopAllAudio() {
  if (state.ambientGain) { state.ambientGain.gain.value = 0; }
  state.ambientNodes.forEach(n => { try { n.stop(); } catch(e){} });
  state.ambientNodes = [];
  if (state.personalAudio) { state.personalAudio.pause(); state.personalAudio.currentTime = 0; }
}

// ─────────────────────────────────────────────
// CREATOR: INTRO
// ─────────────────────────────────────────────
function initIntroScreen() {
  document.getElementById('btn-intro-continue').onclick = () => showScreen('screen-setup');
}

// ─────────────────────────────────────────────
// CREATOR: SETUP
// ─────────────────────────────────────────────
function initSetupScreen() {
  document.querySelectorAll('.rel-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.rel-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.relationship = card.dataset.rel;
    });
  });
  document.getElementById('btn-setup-back').onclick = () => showScreen('screen-intro');
  document.getElementById('btn-setup-continue').onclick = () => {
    state.recipientName = document.getElementById('recipient-name').value.trim();
    renderMemoryCards();
    showScreen('screen-balloons');
  };
}

// ─────────────────────────────────────────────
// CREATOR: MEMORY CARDS
// ─────────────────────────────────────────────
function renderMemoryCards() {
  const list = document.getElementById('balloon-cards-list');
  list.innerHTML = '';
  state.balloons.forEach((b, i) => {
    const div = document.createElement('div');
    div.className = 'balloon-card card';
    div.innerHTML = `
      <div class="balloon-card-header">
        <div class="balloon-card-num">Memory ${i + 1}</div>
        ${state.balloons.length > 2 ? `<button class="remove-balloon-btn" data-idx="${i}">&times;</button>` : ''}
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
          ${b.imageData ? `<img src="${b.imageData}" class="image-preview-thumb"><button class="remove-balloon-btn remove-img-btn">&times; Remove</button>` : ''}
        </div>
      </div>`;
    list.appendChild(div);

    const ta = div.querySelector('textarea');
    const cc = div.querySelector('.char-count');
    ta.oninput = () => { b.message = ta.value; cc.textContent = `${ta.value.length}/200`; };

    div.querySelector('input[type=file]').onchange = async e => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) { alert('Image too large. Please use an image under 10MB.'); return; }
      b.imageData = await compressImage(file);
      renderMemoryCards();
    };

    const rmv = div.querySelector('[data-idx]');
    if (rmv) rmv.onclick = () => { state.balloons.splice(i, 1); renderMemoryCards(); };

    const rmvImg = div.querySelector('.remove-img-btn');
    if (rmvImg) rmvImg.onclick = () => { b.imageData = null; renderMemoryCards(); };
  });
}

async function compressImage(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h = h * MAX / w; w = MAX; } }
        else { if (h > MAX) { w = w * MAX / h; h = MAX; } }
        const c = document.createElement('canvas');
        c.width = Math.round(w); c.height = Math.round(h);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.72));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function initBalloonsScreen() {
  document.getElementById('btn-balloons-back').onclick = () => showScreen('screen-setup');
  document.getElementById('btn-add-balloon').onclick = () => {
    if (state.balloons.length >= 9) return;
    state.balloons.push({ message: '', imageData: null });
    renderMemoryCards();
  };
  document.getElementById('btn-balloons-continue').onclick = () => {
    const valid = state.balloons.filter(b => b.message.trim());
    if (valid.length < 2) {
      const btn = document.getElementById('btn-balloons-continue');
      btn.textContent = 'Add at least 2 memories 🌸';
      setTimeout(() => { btn.innerHTML = 'Continue &rarr;'; }, 2500);
      return;
    }
    document.getElementById('final-message').value = state.finalMessage;
    document.getElementById('message-count').textContent = `${state.finalMessage.length}/800`;
    showScreen('screen-message');
  };
}

// ─────────────────────────────────────────────
// CREATOR: MESSAGE
// ─────────────────────────────────────────────
function initMessageScreen() {
  const ta = document.getElementById('final-message');
  const cc = document.getElementById('message-count');
  ta.oninput = () => cc.textContent = `${ta.value.length}/800`;
  document.getElementById('btn-message-back').onclick = () => {
    state.finalMessage = ta.value.trim();
    showScreen('screen-balloons');
  };
  document.getElementById('btn-message-preview').onclick = () => {
    state.finalMessage = ta.value.trim();
    showScreen('screen-deploy');
    initDeployScreen();
  };
}

// ─────────────────────────────────────────────
// CREATOR: DEPLOY
// ─────────────────────────────────────────────
function initDeployScreen() {
  document.getElementById('btn-deploy-back').onclick = () => showScreen('screen-message');

  // Build shareData from current state (works for both preview and real deploy)
  state.shareData = {
    relationship: state.relationship,
    name: state.recipientName,
    balloons: state.balloons
      .filter(b => b.message.trim())
      .map(b => ({ message: b.message, imageUrl: b.imageData || null })),
    finalMessage: state.finalMessage
  };

  // Preview button — no backend needed
  document.getElementById('btn-deploy-preview').onclick = () => {
    document.getElementById('preview-banner').classList.remove('hidden');
    beginRecipientFlow(state.shareData);
  };

  // Generate real link
  const linkInput = document.getElementById('share-link');
  linkInput.value = 'Generating your link…';
  generateShareLink();
}

async function generateShareLink() {
  const linkInput = document.getElementById('share-link');
  try {
    const resp = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.shareData)
    });
    if (!resp.ok) { const e = await resp.json(); throw new Error(e.error); }
    const { id } = await resp.json();
    const link = `${location.origin}${location.pathname}?s=${id}`;
    linkInput.value = link;

    document.getElementById('btn-copy-link').onclick = () => {
      navigator.clipboard.writeText(link).then(() => {
        document.getElementById('btn-copy-link').textContent = '✅ Copied!';
        setTimeout(() => document.getElementById('btn-copy-link').innerHTML = '📋 Copy Link', 2500);
      });
    };
    document.getElementById('btn-whatsapp-share').onclick = () => {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`A Mother's Day surprise for you 🌸\n${link}`)}`);
    };
    if (navigator.share) {
      document.getElementById('btn-native-share').onclick = () =>
        navigator.share({ title: "Mother's Day Surprise", url: link });
    } else {
      document.getElementById('btn-native-share').style.display = 'none';
    }
  } catch (err) {
    linkInput.value = err.message || 'Could not generate link. Check your internet connection.';
  }
}

// ─────────────────────────────────────────────
// RECIPIENT FLOW
// ─────────────────────────────────────────────
async function checkUrl() {
  const id = new URLSearchParams(location.search).get('s');
  if (id) {
    state.mode = 'recipient';
    document.getElementById('loading-overlay').classList.remove('hidden');
    document.getElementById('screen-intro').classList.add('hidden');
    try {
      const resp = await fetch('/api/load?id=' + id);
      if (!resp.ok) throw new Error('not found');
      const data = await resp.json();
      beginRecipientFlow(data);
    } catch {
      document.querySelector('.loading-bloom').textContent = '🥀';
      document.querySelector('.loading-text').textContent = 'This surprise couldn\'t be found.';
      document.getElementById('loading-error').textContent = 'The link may have expired or is incorrect.';
    }
  } else {
    // Creator mode
    initIntroScreen();
    initSetupScreen();
    renderMemoryCards();
    initBalloonsScreen();
    initMessageScreen();
    document.getElementById('btn-edit-surprise').onclick = () => {
      document.getElementById('preview-banner').classList.add('hidden');
      stopAllAudio();
      showScreen('screen-deploy');
    };
  }
}

async function beginRecipientFlow(data) {
  // Normalise field names — support both imageUrl and imageData (legacy)
  const balloons = (data.balloons || []).map(b => ({
    message: (b.message || '').trim(),
    imageUrl: b.imageUrl || b.imageData || null
  })).filter(b => b.message);

  state.shareData = { ...data, balloons };
  state.poppedCount = 0;
  state.totalBalloons = balloons.length;

  document.getElementById('welcome-name').textContent = data.name || data.relationship || 'Mom';

  // Silently preload personal audio with a 2s timeout (won't block if missing)
  const audio = new Audio();
  audio.preload = 'auto';
  state.personalAudio = audio;
  const audioReady = new Promise(res => {
    audio.oncanplaythrough = res;
    audio.onerror = res;
    setTimeout(res, 2000);
    audio.src = 'audio/personal-message.mp3';
  });

  // Silently preload images
  const imgReady = balloons
    .filter(b => b.imageUrl)
    .map(b => new Promise(res => { const i = new Image(); i.onload = res; i.onerror = res; i.src = b.imageUrl; }));

  await Promise.all([audioReady, ...imgReady]);

  document.getElementById('loading-overlay').classList.add('hidden');
  showScreen('screen-welcome');

  document.getElementById('btn-start-magic').onclick = () => {
    startAmbientAudio();
    renderBloomsStage();
    showScreen('screen-pop');
  };
}

// ─────────────────────────────────────────────
// BLOOM STAGE
// ─────────────────────────────────────────────
function renderBloomsStage() {
  const stage = document.getElementById('balloons-stage');
  stage.innerHTML = '';
  const blooms = state.shareData.balloons;

  blooms.forEach((b, i) => {
    const el = document.createElement('div');
    el.className = 'balloon-item';
    const isLast = i === blooms.length - 1;
    el.innerHTML = '<span class="bloom-icon">🌸</span>';
    el.style.left = `${10 + Math.random() * 75}%`;
    el.style.top = `${15 + Math.random() * 60}%`;
    el.style.animationDelay = `${Math.random() * 2}s`;
    if (isLast) el.classList.add('locked');
    el.onclick = () => {
      if (el.classList.contains('locked') || el.dataset.popped) return;
      el.dataset.popped = '1';
      el.style.transform = 'scale(1.4)';
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
      state.poppedCount++;
      playSoftChime();
      evolveAmbientAudio();
      setTimeout(() => { showBloomModal(b, isLast); updateCounter(); }, 400);
    };
    stage.appendChild(el);
  });
  updateCounter();
}

function updateCounter() {
  const rem = state.totalBalloons - state.poppedCount;
  const el = document.getElementById('pop-counter');
  if (rem === 1) {
    el.textContent = 'One final memory remains.';
    const last = document.querySelector('.balloon-item.locked');
    if (last) { last.classList.remove('locked'); last.classList.add('locked-glow'); }
  } else if (rem <= 0) {
    el.textContent = '';
  } else {
    el.textContent = `Take your time. ${rem} memories remaining.`;
  }
}

function showBloomModal(bloom, isLast) {
  const modal = document.getElementById('balloon-modal');
  const msgEl = document.getElementById('reveal-balloon-msg');
  const photo = document.getElementById('reveal-photo-area');
  const btn   = document.getElementById('btn-modal-next');
  const line  = document.getElementById('reveal-underline');

  msgEl.textContent = '';
  photo.innerHTML = '';
  btn.classList.add('hidden');
  line.classList.add('hidden');
  line.style.width = '0';

  if (bloom.imageUrl) photo.innerHTML = `<img src="${bloom.imageUrl}">`;

  modal.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('active')));

  // Typewriter
  let idx = 0;
  const text = bloom.message;
  const iv = setInterval(() => {
    msgEl.textContent += text[idx++];
    if (idx >= text.length) {
      clearInterval(iv);
      line.classList.remove('hidden');
      setTimeout(() => line.style.width = '60px', 80);
      setTimeout(() => btn.classList.remove('hidden'), 450);
    }
  }, 42);

  btn.onclick = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 800);
    if (isLast) setTimeout(showFinalReveal, 1000);
  };
}

function showFinalReveal() {
  const data = state.shareData;
  document.getElementById('reveal-name').textContent = data.name || data.relationship || 'Mom';
  document.getElementById('reveal-text').textContent = data.finalMessage || '';
  PARTS.forEach(p => { p.vx *= .3; p.vy *= .3; p.ws *= .5; });
  startPersonalAudio();
  showScreen('screen-reveal');
}

// ─────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initBg();
  checkUrl();
});
