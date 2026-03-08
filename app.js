'use strict';

// ============================================================
// 1. THEME CONFIGURATION
// ============================================================
const THEMES = {
  'womens-day': {
    name: "Women's Day", icon: '🌸', bgIcon: '✨',
    queenTitle: "You're a Queen 👑",
    greeting: "Happy Women's Day",
    primary: '#E8448C', secondary: '#C44569', accent: '#F8A5C2',
    bgFrom: '#FFF0F5', bgMid: '#FFE4F0', bgTo: '#FFC8E4',
    darkBg: false, textColor: '#C44569',
    cardBg: 'rgba(255,255,255,0.88)', glow: 'rgba(232,68,140,0.3)',
    fontDisplay: "'Dancing Script', cursive", fontBody: "'Poppins', sans-serif",
    balloonColors: ['#FF6B9D','#E8448C','#F8A5C2','#C44569','#FF85A1','#FFB6C1','#DB7093','#FF69B4','#FF1493'],
    confetti: ['#FF6B9D','#E8448C','#F8A5C2','#FFD700','#FFFFFF','#C44569'],
    particles: ['🌸','🌺','✨','💫','🦋','🌼','💕'], particleCount: 40,
    message: (n) => `🌟 You're truly Incredible 🌟 My ${n}! ❤️\n\nHappy Women's Day to the girl who somehow manages to annoy me, irritate me, and still be the person I never want to live without. I know you fight a lot of silent battles within yourself, yet you always manage to stay strong, keep smiling, and somehow keep me smiling too.\n\nYour patience, strength, and the way you handle everything quietly honestly amaze me more than you realize. You're more than just a strong, beautiful friend, and most importantly one of the kindest, most adorable humans I know. I'm really lucky to have you in my life. 🌸\n\nThis is to remind you how valued, powerful, and deeply appreciated you are — not just today, but every single day. Keep shining, keep rising, and keep being the amazing force that you are and remember to love yourself always. 💕`
  },
  'birthday': {
    name: "Birthday", icon: '🎂', bgIcon: '🎈',
    queenTitle: "Birthday Star! ⭐",
    greeting: "Happy Birthday",
    primary: '#FF6348', secondary: '#FF4757', accent: '#ECCC68',
    bgFrom: '#FFF9F0', bgMid: '#FFF0E4', bgTo: '#FFE4C8',
    darkBg: false, textColor: '#FF4757',
    cardBg: 'rgba(255,255,255,0.88)', glow: 'rgba(255,99,72,0.3)',
    fontDisplay: "'Pacifico', cursive", fontBody: "'Poppins', sans-serif",
    balloonColors: ['#FF6348','#FFA502','#ECCC68','#7BED9F','#70A1FF','#FF6B81','#FF6348','#FFDD59','#FF4757'],
    confetti: ['#FF6348','#FFA502','#ECCC68','#7BED9F','#70A1FF','#FF6B81'],
    particles: ['🎈','⭐','🎊','✨','🌟','🎉','🎁'], particleCount: 50,
    message: (n) => `🎂 Happy Birthday, ${n}! 🎉\n\nToday we celebrate YOU — the most amazing person who makes every room brighter just by walking in. Another year older, another year more wonderful!\n\nMay this year be your most extraordinary yet, filled with joy, laughter, beautiful adventures, and everything your heart has been dreaming of. You deserve all the happiness in the world.\n\nHere's to you and all the incredible things ahead! 🌟🥂`
  },
  'anniversary': {
    name: "Anniversary", icon: '💑', bgIcon: '❤️',
    queenTitle: "Love Eternal 💍",
    greeting: "Happy Anniversary",
    primary: '#C0392B', secondary: '#8B0000', accent: '#D4A017',
    bgFrom: '#FFF8F0', bgMid: '#FFF0E4', bgTo: '#FFDAB9',
    darkBg: false, textColor: '#8B0000',
    cardBg: 'rgba(255,255,255,0.88)', glow: 'rgba(192,57,43,0.3)',
    fontDisplay: "'Playfair Display', serif", fontBody: "'Poppins', sans-serif",
    balloonColors: ['#C0392B','#8B0000','#D4A017','#E74C3C','#F39C12','#922B21','#CB4335','#E59866','#D4AC0D'],
    confetti: ['#C0392B','#D4A017','#FFD700','#FFFFFF','#8B0000','#F39C12'],
    particles: ['❤️','🌹','💕','✨','💎','💐','💖'], particleCount: 35,
    message: (n) => `💑 Happy Anniversary, ${n}! ❤️\n\nEvery day with you is a beautiful gift that I treasure with all my heart. Our journey together has been filled with endless laughter, quiet moments, and memories that I'll cherish forever.\n\nThank you for being my partner, my best friend, and the greatest adventure of my life. Every year with you is better than the last.\n\nHere's to forever and beyond. 💍💕`
  },
  'valentines': {
    name: "Valentine's Day", icon: '❤️', bgIcon: '💕',
    queenTitle: "My Valentine 💝",
    greeting: "Happy Valentine's Day",
    primary: '#E84393', secondary: '#C0392B', accent: '#FF69B4',
    bgFrom: '#FFF0F5', bgMid: '#FFE4ED', bgTo: '#FFC8D8',
    darkBg: false, textColor: '#C0392B',
    cardBg: 'rgba(255,255,255,0.88)', glow: 'rgba(232,67,147,0.3)',
    fontDisplay: "'Dancing Script', cursive", fontBody: "'Poppins', sans-serif",
    balloonColors: ['#E84393','#C0392B','#FF69B4','#FF1493','#DC143C','#FF6B9D','#FF85A1','#FFB6C1','#DB7093'],
    confetti: ['#E84393','#C0392B','#FF69B4','#FFD700','#FFFFFF','#FF1493'],
    particles: ['❤️','💕','💗','💖','💝','💓','💞'], particleCount: 45,
    message: (n) => `❤️ Happy Valentine's Day, ${n}! 💕\n\nYou are the most wonderful person in my entire world. Every moment with you feels like pure magic — your laughter, your kindness, your beautiful soul.\n\nMy heart belongs to you, today and always. Thank you for making every single day brighter, warmer, and more meaningful just by being you.\n\nForever yours. 💝`
  },
  'new-year': {
    name: "New Year", icon: '🎆', bgIcon: '✨',
    queenTitle: "New Year Magic ✨",
    greeting: "Happy New Year",
    primary: '#FFD700', secondary: '#FFA500', accent: '#C0C0C0',
    bgFrom: '#1a1a2e', bgMid: '#16213e', bgTo: '#0f3460',
    darkBg: true, textColor: '#FFD700',
    cardBg: 'rgba(255,255,255,0.08)', glow: 'rgba(255,215,0,0.4)',
    fontDisplay: "'Montserrat', sans-serif", fontBody: "'Montserrat', sans-serif",
    balloonColors: ['#FFD700','#FFA500','#FF6B6B','#4ECDC4','#45B7D1','#C0C0C0','#FF6B9D','#7BED9F','#70A1FF'],
    confetti: ['#FFD700','#FFA500','#C0C0C0','#FFFFFF','#FF6B6B','#4ECDC4'],
    particles: ['✨','⭐','🌟','💫','🎆','🌙','🎇'], particleCount: 60,
    message: (n) => `🎆 Happy New Year, ${n}! ✨\n\nAs we step into this brand new year, I'm so grateful beyond words to have you in my life. You make every chapter worth living.\n\nMay this year bring you extraordinary joy, breathtaking adventures, and all the dreams you've been chasing. The best is absolutely yet to come!\n\nHere's to making this the most magical year yet! 🥂🌟`
  },
  'graduation': {
    name: "Graduation", icon: '🎓', bgIcon: '⭐',
    queenTitle: "You Did It! 🎓",
    greeting: "Congratulations",
    primary: '#2C3E50', secondary: '#1A252F', accent: '#F39C12',
    bgFrom: '#F0F8FF', bgMid: '#E8F4FD', bgTo: '#D6EAF8',
    darkBg: false, textColor: '#2C3E50',
    cardBg: 'rgba(255,255,255,0.88)', glow: 'rgba(44,62,80,0.2)',
    fontDisplay: "'Merriweather', serif", fontBody: "'Poppins', sans-serif",
    balloonColors: ['#2C3E50','#F39C12','#3498DB','#27AE60','#8E44AD','#E74C3C','#1ABC9C','#E67E22','#2980B9'],
    confetti: ['#2C3E50','#F39C12','#3498DB','#27AE60','#FFFFFF','#E74C3C'],
    particles: ['🎓','⭐','✨','🌟','🏆','📚','🎊'], particleCount: 40,
    message: (n) => `🎓 Congratulations, ${n}! 🏆\n\nYou did it! All those late nights, early mornings, and moments of doubt — they all led to THIS. And look at you now.\n\nYour hard work, dedication, and brilliance have brought you here. This achievement is just the beginning of your extraordinary journey. The world is ready for everything you're going to accomplish.\n\nWe are SO incredibly proud of you! ✨🌟`
  },
  'mothers-day': {
    name: "Mother's Day", icon: '💐', bgIcon: '🌷',
    queenTitle: "World's Best Mom 👑",
    greeting: "Happy Mother's Day",
    primary: '#9B59B6', secondary: '#6C3483', accent: '#F1948A',
    bgFrom: '#FDF0FF', bgMid: '#F5E8FF', bgTo: '#EDD5F5',
    darkBg: false, textColor: '#6C3483',
    cardBg: 'rgba(255,255,255,0.88)', glow: 'rgba(155,89,182,0.3)',
    fontDisplay: "'Dancing Script', cursive", fontBody: "'Poppins', sans-serif",
    balloonColors: ['#9B59B6','#6C3483','#F1948A','#D98880','#BB8FCE','#C39BD3','#A569BD','#D7BDE2','#E8DAEF'],
    confetti: ['#9B59B6','#F1948A','#FFD700','#FFFFFF','#6C3483','#BB8FCE'],
    particles: ['💐','🌷','💜','✨','🌸','🌺','💕'], particleCount: 40,
    message: (n) => `💐 Happy Mother's Day, ${n}! 💜\n\nThank you for your endless love that never asks for anything in return, for your unwavering support through every season of life, and for the warmth of your beautiful heart that feels like home.\n\nYou are the foundation we all stand on, the light that guides us, and the reason kindness and strength make sense to us.\n\nOn this special day, know that you are loved beyond words. 🌷`
  },
  'friendship': {
    name: "Friendship Day", icon: '🤝', bgIcon: '💛',
    queenTitle: "Best Friend Ever! 🌟",
    greeting: "Happy Friendship Day",
    primary: '#F39C12', secondary: '#E67E22', accent: '#58D68D',
    bgFrom: '#FFFBF0', bgMid: '#FFF5E0', bgTo: '#FFEBC8',
    darkBg: false, textColor: '#E67E22',
    cardBg: 'rgba(255,255,255,0.88)', glow: 'rgba(243,156,18,0.3)',
    fontDisplay: "'Pacifico', cursive", fontBody: "'Poppins', sans-serif",
    balloonColors: ['#F39C12','#E67E22','#58D68D','#3498DB','#9B59B6','#E74C3C','#1ABC9C','#F1C40F','#2ECC71'],
    confetti: ['#F39C12','#58D68D','#3498DB','#FFFFFF','#E67E22','#9B59B6'],
    particles: ['🤝','⭐','💛','✨','🌈','💫','🎊'], particleCount: 45,
    message: (n) => `🤝 Happy Friendship Day, ${n}! 💛\n\nHaving you as a friend is one of the greatest gifts life has ever given me. You bring sunshine into every moment, laughter into every challenge, and meaning into the everyday.\n\nThank you for always showing up, for understanding me when no one else could, and for making this world so much more colorful and full of life.\n\nHere's to us, forever! 🌈`
  }
};

// ============================================================
// 2. APP STATE
// ============================================================
const state = {
  mode: 'creator',        // 'creator' | 'recipient'
  isPreview: false,       // creator previewing recipient flow
  screen: 'setup',
  occasion: 'womens-day',
  recipientName: '',
  balloons: [             // [{message, imageData}]
    { message: '', imageData: null },
    { message: '', imageData: null },
    { message: '', imageData: null }
  ],
  finalMessage: '',
  // Recipient playback state
  shareData: null,
  poppedCount: 0,
  totalBalloons: 0,
  audioCtx: null,
  pianoScheduled: false,
  pianoNodes: [],
  bgAnimFrame: null,
  particles: [],
  fireworkCanvas: null,
  fireworkCtx: null,
  fireworkParticles: []
};

// ============================================================
// 3. THEME APPLICATION
// ============================================================
function applyTheme(key) {
  const t = THEMES[key];
  if (!t) return;
  const r = document.documentElement.style;
  r.setProperty('--primary', t.primary);
  r.setProperty('--secondary', t.secondary);
  r.setProperty('--accent', t.accent);
  r.setProperty('--bg-from', t.bgFrom);
  r.setProperty('--bg-mid', t.bgMid);
  r.setProperty('--bg-to', t.bgTo);
  r.setProperty('--text-color', t.textColor);
  r.setProperty('--card-bg', t.cardBg);
  r.setProperty('--glow', t.glow);
  r.setProperty('--font-display', t.fontDisplay);
  r.setProperty('--font-body', t.fontBody);
  document.body.style.background = `linear-gradient(135deg, ${t.bgFrom} 0%, ${t.bgMid} 50%, ${t.bgTo} 100%)`;
  if (t.darkBg) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  state.occasion = key;
}

// ============================================================
// 4. BACKGROUND PARTICLE SYSTEM
// ============================================================
let bgCanvas, bgCtx, bgWidth, bgHeight;
const PARTICLES = [];

function initBackground() {
  bgCanvas = document.getElementById('bg-canvas');
  bgCtx = bgCanvas.getContext('2d');
  resizeBackground();
  window.addEventListener('resize', resizeBackground);
  spawnParticles();
  animateBackground();
}

function resizeBackground() {
  bgWidth = bgCanvas.width = window.innerWidth;
  bgHeight = bgCanvas.height = window.innerHeight;
}

function spawnParticles() {
  PARTICLES.length = 0;
  const t = THEMES[state.occasion];
  const count = t.particleCount;
  for (let i = 0; i < count; i++) {
    PARTICLES.push(createParticle(true));
  }
}

function createParticle(randomY = false) {
  const t = THEMES[state.occasion];
  const emoji = t.particles[Math.floor(Math.random() * t.particles.length)];
  const z = Math.random() * 800 + 100;
  return {
    x: Math.random() * bgWidth,
    y: randomY ? Math.random() * bgHeight : bgHeight + 50,
    z: z,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -(Math.random() * 0.8 + 0.3),
    vz: (Math.random() - 0.5) * 0.5,
    emoji: emoji,
    opacity: Math.random() * 0.5 + 0.15,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 1.5,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.02 + 0.01
  };
}

function animateBackground() {
  if (!bgCtx) return;
  bgCtx.clearRect(0, 0, bgWidth, bgHeight);

  const focalLength = 600;
  const cx = bgWidth / 2;
  const cy = bgHeight / 2;

  for (let i = PARTICLES.length - 1; i >= 0; i--) {
    const p = PARTICLES[i];
    p.wobble += p.wobbleSpeed;
    p.x += p.vx + Math.sin(p.wobble) * 0.3;
    p.y += p.vy;
    p.z += p.vz;
    p.rotation += p.rotSpeed;

    if (p.z < 10) p.z = 900;
    if (p.z > 1000) p.z = 50;
    if (p.y < -60) {
      PARTICLES[i] = createParticle(false);
      continue;
    }

    const scale = focalLength / (focalLength + p.z);
    const sx = (p.x - cx) * scale + cx;
    const sy = (p.y - cy) * scale + cy;
    const sz = Math.max(6, 24 * scale);
    const alpha = p.opacity * scale * 1.5;

    bgCtx.save();
    bgCtx.globalAlpha = Math.min(alpha, 0.65);
    bgCtx.font = `${sz}px serif`;
    bgCtx.translate(sx, sy);
    bgCtx.rotate((p.rotation * Math.PI) / 180);
    bgCtx.fillText(p.emoji, -sz / 2, sz / 3);
    bgCtx.restore();
  }

  state.bgAnimFrame = requestAnimationFrame(animateBackground);
}

// ============================================================
// 5. AUDIO SYSTEM
// ============================================================
function getAudioCtx() {
  if (!state.audioCtx) {
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }
  return state.audioCtx;
}

function playPopSound() {
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;

    // Noise burst
    const bufSize = ctx.sampleRate * 0.15;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;

    // Band-pass filter for "pop" quality
    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 220;
    bpf.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(1.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    src.connect(bpf);
    bpf.connect(gain);
    gain.connect(ctx.destination);
    src.start(t);
    src.stop(t + 0.2);

    // Pitch click
    const osc = ctx.createOscillator();
    const oGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);
    oGain.gain.setValueAtTime(0.4, t);
    oGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(oGain);
    oGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  } catch(e) {}
}

function playPianoNote(ctx, freq, startTime, duration) {
  const harmonics = [1, 2, 4, 8];
  const volumes = [0.4, 0.15, 0.06, 0.02];
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, startTime);
  master.gain.linearRampToValueAtTime(0.12, startTime + 0.015);
  master.gain.setValueAtTime(0.12, startTime + 0.02);
  master.gain.exponentialRampToValueAtTime(0.04, startTime + duration * 0.4);
  master.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  const rev = createReverb(ctx);
  master.connect(rev);
  rev.connect(ctx.destination);
  master.connect(ctx.destination);

  harmonics.forEach((h, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq * h;
    g.gain.value = volumes[i];
    osc.connect(g);
    g.connect(master);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.5);
    state.pianoNodes.push(osc);
  });
}

function createReverb(ctx) {
  const conv = ctx.createConvolver();
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
  }
  conv.buffer = buf;
  return conv;
}

// Note frequencies
const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25,
  D5: 587.33, E5: 659.25, G3: 196.00, A3: 220.00,
  F3: 174.61, C3: 130.81
};

// Beautiful piano melodies per occasion
const MELODIES = {
  'womens-day':  [
    [NOTES.C4,1.2],[NOTES.E4,1.0],[NOTES.G4,1.0],[NOTES.A4,1.4],
    [NOTES.G4,0.8],[NOTES.E4,0.8],[NOTES.F4,1.0],[NOTES.E4,1.0],
    [NOTES.D4,0.8],[NOTES.C4,1.2],[NOTES.E4,1.0],[NOTES.G4,1.6]
  ],
  'birthday': [
    [NOTES.C4,0.6],[NOTES.C4,0.6],[NOTES.D4,1.0],[NOTES.C4,1.0],[NOTES.F4,1.0],[NOTES.E4,1.8],
    [NOTES.C4,0.6],[NOTES.C4,0.6],[NOTES.D4,1.0],[NOTES.C4,1.0],[NOTES.G4,1.0],[NOTES.F4,1.8]
  ],
  'anniversary': [
    [NOTES.C4,1.5],[NOTES.G3,1.0],[NOTES.A3,1.0],[NOTES.E4,1.5],
    [NOTES.D4,1.0],[NOTES.C4,1.0],[NOTES.G4,2.0],[NOTES.F4,1.5],[NOTES.E4,2.5]
  ],
  'valentines': [
    [NOTES.E4,1.0],[NOTES.G4,0.8],[NOTES.A4,1.2],[NOTES.B4,0.8],
    [NOTES.A4,0.8],[NOTES.G4,1.0],[NOTES.E4,1.5],[NOTES.D4,0.8],[NOTES.C4,2.0]
  ],
  'new-year': [
    [NOTES.C4,0.5],[NOTES.E4,0.5],[NOTES.G4,0.5],[NOTES.C5,1.5],
    [NOTES.B4,0.5],[NOTES.G4,0.5],[NOTES.E4,1.0],[NOTES.D4,0.5],[NOTES.C4,2.0]
  ],
  'graduation': [
    [NOTES.C4,1.0],[NOTES.D4,1.0],[NOTES.E4,1.0],[NOTES.F4,2.0],
    [NOTES.E4,1.0],[NOTES.D4,1.0],[NOTES.C4,0.5],[NOTES.E4,0.5],[NOTES.G4,3.0]
  ],
  'mothers-day': [
    [NOTES.G3,1.2],[NOTES.C4,1.0],[NOTES.E4,1.0],[NOTES.G4,1.5],
    [NOTES.F4,0.8],[NOTES.E4,0.8],[NOTES.D4,1.0],[NOTES.C4,2.5]
  ],
  'friendship': [
    [NOTES.C4,0.8],[NOTES.E4,0.8],[NOTES.G4,0.8],[NOTES.E4,0.8],[NOTES.C5,1.5],
    [NOTES.A4,0.8],[NOTES.G4,1.0],[NOTES.F4,0.8],[NOTES.E4,0.8],[NOTES.C4,2.0]
  ]
};

function startPianoMusic(occasionKey) {
  if (state.pianoScheduled) return;
  try {
    const ctx = getAudioCtx();
    const melody = MELODIES[occasionKey] || MELODIES['womens-day'];
    state.pianoScheduled = true;

    function scheduleMelody(startAt) {
      let t = startAt;
      melody.forEach(([freq, dur]) => {
        playPianoNote(ctx, freq, t, dur + 0.8);
        // Add bass note (octave down)
        playPianoNote(ctx, freq * 0.5, t, dur + 1.0);
        t += dur * 0.52 + 0.08;
      });
      return t;
    }

    let nextStart = ctx.currentTime;
    const totalDur = scheduleMelody(nextStart);
    // Loop
    const loopInterval = (totalDur - ctx.currentTime) * 1000 + 500;
    state.pianoLoop = setInterval(() => {
      if (!state.pianoScheduled) { clearInterval(state.pianoLoop); return; }
      const c2 = getAudioCtx();
      scheduleMelody(c2.currentTime);
    }, loopInterval);

    // Floating music notes UI
    scheduleFloatingNotes();
  } catch(e) {}
}

function stopPianoMusic() {
  state.pianoScheduled = false;
  if (state.pianoLoop) clearInterval(state.pianoLoop);
  state.pianoNodes.forEach(n => { try { n.stop(); } catch(e) {} });
  state.pianoNodes = [];
}

function scheduleFloatingNotes() {
  const notes = ['♪','♫','♩','♬'];
  let count = 0;
  const iv = setInterval(() => {
    if (!state.pianoScheduled || count > 20) { clearInterval(iv); return; }
    count++;
    const el = document.createElement('div');
    el.className = 'music-note';
    el.textContent = notes[Math.floor(Math.random() * notes.length)];
    el.style.left = Math.random() * 90 + 5 + 'vw';
    el.style.bottom = Math.random() * 30 + 10 + 'vh';
    el.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary');
    el.style.animationDuration = (Math.random() * 2 + 3) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }, 800);
}

// ============================================================
// 6. SCREEN MANAGEMENT
// ============================================================
function showScreen(id, delay = 0) {
  setTimeout(() => {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.add('hidden');
      s.classList.remove('active');
    });
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('hidden');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.add('active');
        });
      });
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, delay);
}

// ============================================================
// 7. SETUP SCREEN
// ============================================================
function initSetupScreen() {
  const grid = document.getElementById('occasion-grid');
  grid.innerHTML = '';
  Object.entries(THEMES).forEach(([key, t]) => {
    const card = document.createElement('div');
    card.className = 'occasion-card' + (state.occasion === key ? ' selected' : '');
    card.innerHTML = `<span class="occ-icon">${t.icon}</span><span class="occ-name">${t.name}</span>`;
    card.addEventListener('click', () => {
      document.querySelectorAll('.occasion-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      applyTheme(key);
      spawnParticles();
      updateSetupContinue();
      // Clear saved message when occasion changes so textarea resets
      state.finalMessage = '';
    });
    grid.appendChild(card);
  });

  const nameInput = document.getElementById('recipient-name');
  const nameCount = document.getElementById('name-count');
  nameInput.addEventListener('input', () => {
    nameCount.textContent = `${nameInput.value.length}/40`;
    updateSetupContinue();
  });
  nameInput.value = state.recipientName;
  nameCount.textContent = `${state.recipientName.length}/40`;

  document.getElementById('btn-setup-continue').addEventListener('click', () => {
    state.recipientName = document.getElementById('recipient-name').value.trim();
    if (!state.recipientName) return;
    applyTheme(state.occasion);
    renderBalloonsScreen();
    showScreen('screen-balloons');
  });

  updateSetupContinue();
}

function updateSetupContinue() {
  const nameVal = document.getElementById('recipient-name').value.trim();
  document.getElementById('btn-setup-continue').disabled = !nameVal;
}

// ============================================================
// 8. BALLOONS SCREEN
// ============================================================
function renderBalloonsScreen() {
  const t = THEMES[state.occasion];
  document.getElementById('balloons-subtitle').textContent =
    `Add 3–9 surprise messages for ${state.recipientName}'s ${t.name} surprise. Each balloon reveals one when popped! One last balloon is reserved for a special message.`;

  renderBalloonCards();

  // Wire buttons
  document.getElementById('btn-balloons-back').onclick = () => {
    showScreen('screen-setup');
  };
  document.getElementById('btn-balloons-continue').onclick = () => {
    const msgs = state.balloons.filter(b => b.message.trim());
    if (msgs.length < 1) {
      alert('Please add at least one message!');
      return;
    }
    // Restore previously typed message if coming back from deploy screen
    document.getElementById('final-message').value = state.finalMessage || '';
    document.getElementById('message-count').textContent =
      `${(state.finalMessage || '').length}/800`;
    document.getElementById('message-subtitle').textContent =
      `Write your personal final message for ${state.recipientName} — this appears after all balloons are popped!`;
    showScreen('screen-message');
  };
  document.getElementById('btn-add-balloon').onclick = () => {
    if (state.balloons.length >= 9) {
      alert('Maximum 9 balloons allowed!');
      return;
    }
    state.balloons.push({ message: '', imageData: null });
    renderBalloonCards();
  };
}

function renderBalloonCards() {
  const list = document.getElementById('balloon-cards-list');
  list.innerHTML = '';
  state.balloons.forEach((balloon, i) => {
    const card = document.createElement('div');
    card.className = 'balloon-card';
    card.innerHTML = `
      <div class="balloon-card-header">
        <div class="balloon-card-num">
          <div class="bnum-circle">${i + 1}</div>
          Balloon ${i + 1}
          ${i === 0 ? '<small style="font-size:0.7rem;font-family:var(--font-body);color:#aaa;margin-left:4px;">(first image used for welcome screen)</small>' : ''}
        </div>
        ${state.balloons.length > 1 ? `<button class="remove-balloon-btn" data-idx="${i}" title="Remove">✕</button>` : ''}
      </div>
      <div class="form-group">
        <label class="form-label">Surprise Message:</label>
        <textarea class="form-textarea" maxlength="120" placeholder="Enter your surprise message..." data-balloon="${i}">${balloon.message}</textarea>
        <span class="char-count">${balloon.message.length}/120</span>
      </div>
      <div class="form-group">
        <label class="form-label">Surprise Image: <span style="color:#bbb;font-size:0.78rem;font-weight:400;">(optional)</span></label>
        <div class="image-upload-area">
          <label class="upload-btn" style="cursor:pointer;">
            📷 Upload Image
            <input type="file" accept="image/*" style="display:none;" data-balloon="${i}" class="img-file-input">
          </label>
          ${balloon.imageData ? `
            <img src="${balloon.imageData}" class="image-preview-thumb" title="Click to remove" data-rmv="${i}">
            <button class="remove-img-btn" data-rmv="${i}">✕ Remove</button>
          ` : ''}
        </div>
      </div>
    `;
    list.appendChild(card);

    // Textarea char count
    const ta = card.querySelector('textarea');
    const cc = card.querySelector('.char-count');
    ta.addEventListener('input', () => {
      state.balloons[i].message = ta.value;
      cc.textContent = `${ta.value.length}/120`;
    });

    // Image upload
    const fileInput = card.querySelector('.img-file-input');
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const compressed = await compressImage(file);
      state.balloons[i].imageData = compressed;
      renderBalloonCards();
    });

    // Remove balloon
    const rmvBtn = card.querySelector('.remove-balloon-btn');
    if (rmvBtn) {
      rmvBtn.addEventListener('click', () => {
        state.balloons.splice(i, 1);
        renderBalloonCards();
      });
    }

    // Remove image
    const rmvImg = card.querySelector('[data-rmv]');
    if (rmvImg) {
      rmvImg.addEventListener('click', () => {
        state.balloons[i].imageData = null;
        renderBalloonCards();
      });
    }
    const rmvImgBtn = card.querySelector('.remove-img-btn');
    if (rmvImgBtn) {
      rmvImgBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.balloons[i].imageData = null;
        renderBalloonCards();
      });
    }
  });
}

async function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 280;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h = h * MAX / w; w = MAX; } }
        else { if (h > MAX) { w = w * MAX / h; h = MAX; } }
        const c = document.createElement('canvas');
        c.width = Math.round(w); c.height = Math.round(h);
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.45));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ============================================================
// 9. FINAL MESSAGE SCREEN
// ============================================================
function initMessageScreen() {
  const ta = document.getElementById('final-message');
  const cc = document.getElementById('message-count');
  ta.addEventListener('input', () => {
    cc.textContent = `${ta.value.length}/800`;
  });

  document.getElementById('btn-message-back').onclick = () => {
    // Save current message before going back
    state.finalMessage = ta.value.trim();
    renderBalloonsScreen();
    showScreen('screen-balloons');
  };

  document.getElementById('btn-message-preview').onclick = () => {
    state.finalMessage = ta.value.trim();
    if (!state.finalMessage) {
      alert('Please add a final message!');
      return;
    }
    initDeployScreen();
    showScreen('screen-deploy');
  };
}

// ============================================================
// 10. DEPLOY SCREEN
// ============================================================
function initDeployScreen() {
  const data = {
    occasion: state.occasion,
    name: state.recipientName,
    balloons: state.balloons.map(b => ({
      message: b.message,
      imageData: b.imageData
    })),
    finalMessage: state.finalMessage
  };

  let link = '';
  try {
    const json = JSON.stringify(data);
    const compressed = LZString.compressToEncodedURIComponent(json);
    link = window.location.origin + window.location.pathname + '#s=' + compressed;
  } catch(e) {
    link = 'Error generating link. Data may be too large.';
  }

  document.getElementById('share-link').value = link;

  // Stats
  const statsEl = document.getElementById('deploy-stats');
  const validBalloons = state.balloons.filter(b => b.message.trim()).length;
  const withImages = state.balloons.filter(b => b.imageData).length;
  statsEl.innerHTML = `
    <div class="stat-chip">${THEMES[state.occasion].icon} ${THEMES[state.occasion].name}</div>
    <div class="stat-chip">🎈 ${validBalloons} balloon${validBalloons !== 1 ? 's' : ''}</div>
    ${withImages ? `<div class="stat-chip">📷 ${withImages} image${withImages !== 1 ? 's' : ''}</div>` : ''}
  `;

  document.getElementById('btn-copy-link').onclick = () => {
    navigator.clipboard.writeText(link).then(() => {
      const btn = document.getElementById('btn-copy-link');
      const icon = document.getElementById('copy-icon');
      icon.textContent = '✅';
      btn.classList.add('copy-success');
      btn.style.background = '#27AE60';
      setTimeout(() => {
        icon.textContent = '📋';
        btn.style.background = '';
        btn.classList.remove('copy-success');
      }, 2000);
    }).catch(() => {
      const inp = document.getElementById('share-link');
      inp.select();
      document.execCommand('copy');
    });
  };

  document.getElementById('btn-deploy-back').onclick = () => {
    showScreen('screen-message');
  };

  document.getElementById('btn-deploy-preview').onclick = () => {
    state.isPreview = true;
    state.shareData = data;
    document.getElementById('preview-banner').classList.remove('hidden');
    startRecipientFlow(data);
  };
}

// ============================================================
// 11. RECIPIENT FLOW ENTRY
// ============================================================
function startRecipientFlow(data) {
  const t = THEMES[data.occasion];
  applyTheme(data.occasion);
  spawnParticles();
  renderWelcomeScreen(data);
  showScreen('screen-welcome');
}

// ============================================================
// 12. WELCOME SCREEN (Recipient)
// ============================================================
function renderWelcomeScreen(data) {
  const t = THEMES[data.occasion];
  document.getElementById('welcome-greeting').textContent = t.greeting;
  document.getElementById('welcome-name').textContent = data.name + ' ✨';
  document.getElementById('welcome-queen-title').textContent = t.queenTitle;
  document.getElementById('welcome-subtext').textContent =
    `I've prepared something very special for you. Pop all the balloons on the next screen to uncover! 🎈`;

  // Profile circle
  const circle = document.getElementById('profile-circle');
  const firstImage = data.balloons.find(b => b.imageData)?.imageData;
  if (firstImage) {
    circle.innerHTML = `<img src="${firstImage}" alt="${data.name}">`;
  } else {
    circle.textContent = data.name.charAt(0).toUpperCase();
    circle.style.fontSize = '2.5rem';
  }

  document.getElementById('btn-start-magic').onclick = () => {
    state.poppedCount = 0;
    const validBalloons = data.balloons.filter(b => b.message.trim());
    state.totalBalloons = validBalloons.length;
    renderPopScreen(data);
    showScreen('screen-pop');
  };
}

// ============================================================
// 13. POP BALLOONS SCREEN
// ============================================================
function renderPopScreen(data) {
  const t = THEMES[data.occasion];
  const validBalloons = data.balloons.filter(b => b.message.trim());
  state.totalBalloons = validBalloons.length;

  document.getElementById('pop-title').textContent = `Pop the balloons, ${data.name}! 🎈`;
  document.getElementById('pop-counter').textContent = `${validBalloons.length} surprise${validBalloons.length !== 1 ? 's' : ''} remaining`;

  const stage = document.getElementById('balloons-stage');
  stage.innerHTML = '';

  // Positions: spread across the stage
  const positions = generateBalloonPositions(validBalloons.length);

  validBalloons.forEach((balloon, i) => {
    const color = t.balloonColors[i % t.balloonColors.length];
    const tilt = (Math.random() - 0.5) * 12;
    const floatDur = (Math.random() * 1.5 + 2.5).toFixed(2);
    const floatDelay = (Math.random() * 2).toFixed(2);
    const size = 80 + Math.floor(Math.random() * 30);

    const wrap = document.createElement('div');
    wrap.className = 'floating-balloon';
    wrap.style.left = positions[i].x + '%';
    wrap.style.top = positions[i].y + '%';
    wrap.style.zIndex = 2;
    wrap.dataset.index = i;
    wrap.innerHTML = `
      <div class="balloon-svg-wrap" style="--float-dur:${floatDur}s;--float-delay:${floatDelay}s;--tilt:${tilt};">
        ${createBalloonSVG(color, size)}
      </div>
    `;

    wrap.addEventListener('click', (e) => {
      if (wrap.classList.contains('popping')) return;
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      popBalloon(wrap, balloon, cx, cy, data, validBalloons.length);
    });

    stage.appendChild(wrap);
  });
}

function generateBalloonPositions(count) {
  const positions = [];
  const cols = count <= 3 ? count : count <= 6 ? 3 : 4;
  const rows = Math.ceil(count / cols);
  let idx = 0;
  for (let r = 0; r < rows && idx < count; r++) {
    const rowCount = Math.min(cols, count - r * cols);
    for (let c = 0; c < rowCount && idx < count; c++) {
      const xBase = (c + 0.5) / rowCount * 80 + 10;
      const yBase = (r + 0.5) / rows * 65 + 10;
      const xJitter = (Math.random() - 0.5) * 10;
      const yJitter = (Math.random() - 0.5) * 8;
      positions.push({ x: xBase + xJitter, y: yBase + yJitter });
      idx++;
    }
  }
  return positions;
}

function createBalloonSVG(color, size) {
  // Slightly lighter version for highlight
  const highlightColor = lightenColor(color, 40);
  const knotColor = darkenColor(color, 20);
  return `
    <svg width="${size}" height="${Math.round(size * 1.35)}" viewBox="0 0 100 135" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 8px 16px ${color}66);">
      <!-- Body -->
      <ellipse cx="50" cy="52" rx="43" ry="50" fill="${color}"/>
      <!-- Highlight -->
      <ellipse cx="33" cy="30" rx="14" ry="18" fill="${highlightColor}" opacity="0.35"/>
      <ellipse cx="28" cy="26" rx="6" ry="8" fill="white" opacity="0.25"/>
      <!-- Shading -->
      <ellipse cx="67" cy="72" rx="12" ry="16" fill="${darkenColor(color,15)}" opacity="0.2"/>
      <!-- Knot -->
      <path d="M50 102 Q44 108 50 112 Q56 108 50 102Z" fill="${knotColor}"/>
      <!-- String -->
      <path d="M50 112 C46 118 54 124 50 130 C46 134 50 135 50 135" stroke="${knotColor}" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7"/>
    </svg>
  `;
}

function lightenColor(hex, amount) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

function darkenColor(hex, amount) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
}

function popBalloon(balloonEl, balloon, cx, cy, data, total) {
  balloonEl.classList.add('popping');
  playPopSound();

  // Confetti burst
  createConfettiBurst(cx, cy, data.occasion);

  setTimeout(() => {
    balloonEl.style.display = 'none';
    state.poppedCount++;
    const remaining = total - state.poppedCount;
    document.getElementById('pop-counter').textContent =
      remaining > 0 ? `${remaining} surprise${remaining !== 1 ? 's' : ''} remaining` : 'All surprises revealed! ✨';

    // Show reveal modal
    showBalloonReveal(balloon, () => {
      if (state.poppedCount >= total) {
        // All popped! Go to final reveal
        setTimeout(() => {
          initRevealScreen(data);
          showScreen('screen-reveal', 300);
        }, 600);
      }
    });
  }, 400);
}

// ============================================================
// 14. BALLOON REVEAL MODAL
// ============================================================
function showBalloonReveal(balloon, onClose) {
  const modal = document.getElementById('balloon-modal');
  const photoArea = document.getElementById('reveal-photo-area');
  const msgEl = document.getElementById('reveal-balloon-msg');
  const nextBtn = document.getElementById('btn-modal-next');
  const occKey = state.shareData?.occasion || state.occasion || 'womens-day';
  const t = THEMES[occKey] || THEMES['womens-day'];

  // Update button text based on whether this is the last balloon
  const isLast = state.poppedCount >= state.totalBalloons;
  nextBtn.textContent = isLast ? 'Reveal Final Message 🎆' : 'Next 💕';

  // Photo
  if (balloon.imageData) {
    photoArea.innerHTML = `
      <div class="polaroid-frame">
        <img src="${balloon.imageData}" alt="Surprise photo">
      </div>
    `;
  } else {
    photoArea.innerHTML = `<div style="font-size:3.5rem;text-align:center;padding:1.5rem;">${t.icon}</div>`;
  }

  msgEl.textContent = balloon.message;
  modal.classList.remove('hidden');

  const close = () => {
    modal.classList.add('hidden');
    if (onClose) onClose();
  };

  document.getElementById('modal-close').onclick = close;
  document.getElementById('btn-modal-next').onclick = close;
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  }, { once: true });
}

// ============================================================
// 15. CONFETTI SYSTEM
// ============================================================
function createConfettiBurst(cx, cy, occasionKey) {
  const t = THEMES[occasionKey];
  const container = document.getElementById('confetti-container');
  const count = 28;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = t.confetti[Math.floor(Math.random() * t.confetti.length)];
    const angle = (i / count) * 360;
    const distance = 60 + Math.random() * 100;
    const vx = Math.cos((angle * Math.PI) / 180) * distance;
    const vy = Math.sin((angle * Math.PI) / 180) * distance;
    const size = 5 + Math.random() * 7;
    const shape = Math.random() > 0.5 ? '50%' : (Math.random() > 0.5 ? '0' : '2px');

    piece.style.cssText = `
      left: ${cx}px; top: ${cy}px;
      width: ${size}px; height: ${size}px;
      background: ${color};
      border-radius: ${shape};
      position: fixed;
      pointer-events: none;
      z-index: 200;
      transform: translate(0,0) rotate(0deg);
      transition: transform ${0.6 + Math.random() * 0.6}s cubic-bezier(0.25,0.46,0.45,0.94),
                  opacity ${0.8 + Math.random() * 0.4}s ease;
      opacity: 1;
    `;

    container.appendChild(piece);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        piece.style.transform = `translate(${vx}px, ${vy}px) rotate(${Math.random() * 720}deg)`;
        piece.style.opacity = '0';
      });
    });

    setTimeout(() => piece.remove(), 1500);
  }
}

function createFullConfetti(occasionKey) {
  const t = THEMES[occasionKey];
  const container = document.getElementById('confetti-container');
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const color = t.confetti[Math.floor(Math.random() * t.confetti.length)];
      const x = Math.random() * 100;
      const size = 6 + Math.random() * 8;
      const dur = 2 + Math.random() * 3;
      const shape = Math.random() > 0.5 ? '50%' : '2px';

      piece.style.cssText = `
        left: ${x}vw;
        top: -20px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${shape};
        animation: confettiFall ${dur}s linear forwards;
        animation-delay: ${Math.random() * 1}s;
      `;
      container.appendChild(piece);
      setTimeout(() => piece.remove(), (dur + 1.5) * 1000);
    }, i * 40);
  }
}

// ============================================================
// 16. FINAL REVEAL SCREEN
// ============================================================
function initRevealScreen(data) {
  const t = THEMES[data.occasion];
  document.getElementById('reveal-greeting').textContent = t.greeting;
  document.getElementById('reveal-name').textContent = data.name + ' ✨';
  document.getElementById('reveal-text').textContent = '';

  // Start piano music
  setTimeout(() => startPianoMusic(data.occasion), 500);

  // Typewriter effect
  setTimeout(() => {
    typewriterEffect(document.getElementById('reveal-text'), data.finalMessage);
  }, 800);

  // Full confetti
  setTimeout(() => createFullConfetti(data.occasion), 400);
}

function typewriterEffect(el, text) {
  el.textContent = '';
  // Place cursor directly after the paragraph element
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  el.insertAdjacentElement('afterend', cursor);

  let i = 0;
  // Faster typewriter: ~25ms per char, finishes 800 chars in ~20 seconds
  const speed = Math.max(8, Math.min(22, 3000 / text.length));

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // Blink a few more times then fade out
      setTimeout(() => {
        cursor.style.transition = 'opacity 1s ease';
        cursor.style.opacity = '0';
        setTimeout(() => cursor.remove(), 1100);
      }, 3500);
    }
  }
  type();
}

// ============================================================
// 17. URL ENCODING / DECODING
// ============================================================
function encodeShareData(data) {
  try {
    const json = JSON.stringify(data);
    return LZString.compressToEncodedURIComponent(json);
  } catch(e) {
    return null;
  }
}

function decodeShareData(hash) {
  try {
    const encoded = hash.replace('#s=', '');
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    return JSON.parse(json);
  } catch(e) {
    return null;
  }
}

// ============================================================
// 18. PREVIEW BANNER
// ============================================================
function initPreviewBanner() {
  document.getElementById('btn-edit-surprise').onclick = () => {
    stopPianoMusic();
    state.isPreview = false;
    state.poppedCount = 0;
    document.getElementById('preview-banner').classList.add('hidden');
    document.getElementById('balloon-modal').classList.add('hidden');
    // Clear confetti
    document.getElementById('confetti-container').innerHTML = '';
    initDeployScreen();
    showScreen('screen-deploy');
  };
}

// ============================================================
// 19. INITIALIZATION
// ============================================================
function init() {
  // Check URL for share data
  const hash = window.location.hash;
  if (hash && hash.startsWith('#s=')) {
    const data = decodeShareData(hash);
    if (data) {
      // Recipient mode
      state.mode = 'recipient';
      state.shareData = data;
      applyTheme(data.occasion);
      initBackground();
      initPreviewBanner();
      startRecipientFlow(data);
      return;
    }
  }

  // Creator mode
  state.mode = 'creator';
  applyTheme(state.occasion);
  initBackground();
  initSetupScreen();
  initMessageScreen();
  initPreviewBanner();
  showScreen('screen-setup');

  // Clear URL hash if any junk
  if (window.location.hash && !hash.startsWith('#s=')) {
    history.replaceState(null, '', window.location.pathname);
  }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
