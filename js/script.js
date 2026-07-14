// ============================================================
// Reduced motion check
// ============================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================================
// Reveal on scroll
// ============================================================
(function initReveals(){
  const selectors = ['.project', '.specsheet', '.stack__group', '.lab__panel', '.contact__grid'];
  const els = document.querySelectorAll(selectors.join(','));
  els.forEach(el => el.classList.add('reveal'));

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => observer.observe(el));
})();

// ============================================================
// Hero ambient waveform (decorative)
// ============================================================
(function initHeroCanvas(){
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  let t = 0;

  function drawStatic(){
    ctx.clearRect(0, 0, w, h);
    drawLine('#F2A93B', 0.35, 0.5, 22, 1.3);
    drawLine('#4FD1C5', 0.22, 0.62, 34, 0.8);
  }

  function drawLine(color, amp, yFrac, wavelength, speedMult){
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    const baseY = h * yFrac;
    for (let x = 0; x <= w; x += 4) {
      const y = baseY
        + Math.sin((x / wavelength) + t * speedMult) * h * amp * 0.06
        + Math.sin((x / (wavelength * 2.3)) - t * speedMult * 0.6) * h * amp * 0.03;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function frame(){
    t += 0.012;
    ctx.clearRect(0, 0, w, h);
    drawLine('#F2A93B', 0.35, 0.48, 22, 1.3);
    drawLine('#4FD1C5', 0.22, 0.6, 34, 0.8);
    requestAnimationFrame(frame);
  }

  if (prefersReducedMotion) {
    drawStatic();
  } else {
    frame();
  }
})();

// ============================================================
// Signal Lab: real 2nd-order Butterworth biquad bandpass filter
// ============================================================
(function initSignalLab(){
  const canvas = document.getElementById('labCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const SAMPLE_RATE = 500; // simulated rate for browser visualization
  const WINDOW_SECONDS = 4;
  const N = SAMPLE_RATE * WINDOW_SECONDS;

  const lowCutInput = document.getElementById('lowCut');
  const highCutInput = document.getElementById('highCut');
  const noiseInput = document.getElementById('noiseAmt');
  const lowCutVal = document.getElementById('lowCutVal');
  const highCutVal = document.getElementById('highCutVal');
  const noiseAmtVal = document.getElementById('noiseAmtVal');
  const rmsRawEl = document.getElementById('rmsRaw');
  const rmsFilteredEl = document.getElementById('rmsFiltered');
  const rollVarEl = document.getElementById('rollVar');

  class Biquad {
    constructor(){ this.b0=1; this.b1=0; this.b2=0; this.a1=0; this.a2=0; this.x1=0; this.x2=0; this.y1=0; this.y2=0; }
    setLowpass(freq, Q, sr){
      freq = Math.min(freq, sr/2 - 1);
      const w0 = 2*Math.PI*freq/sr;
      const alpha = Math.sin(w0)/(2*Q);
      const cosw0 = Math.cos(w0);
      const b0=(1-cosw0)/2, b1=1-cosw0, b2=(1-cosw0)/2;
      const a0=1+alpha, a1=-2*cosw0, a2=1-alpha;
      this.b0=b0/a0; this.b1=b1/a0; this.b2=b2/a0; this.a1=a1/a0; this.a2=a2/a0;
    }
    setHighpass(freq, Q, sr){
      freq = Math.max(freq, 0.1);
      const w0 = 2*Math.PI*freq/sr;
      const alpha = Math.sin(w0)/(2*Q);
      const cosw0 = Math.cos(w0);
      const b0=(1+cosw0)/2, b1=-(1+cosw0), b2=(1+cosw0)/2;
      const a0=1+alpha, a1=-2*cosw0, a2=1-alpha;
      this.b0=b0/a0; this.b1=b1/a0; this.b2=b2/a0; this.a1=a1/a0; this.a2=a2/a0;
    }
    process(x){
      const y = this.b0*x + this.b1*this.x1 + this.b2*this.x2 - this.a1*this.y1 - this.a2*this.y2;
      this.x2=this.x1; this.x1=x;
      this.y2=this.y1; this.y1=y;
      return y;
    }
  }

  const BUTTERWORTH_Q = 1/Math.SQRT2;
  const hp = new Biquad();
  const lp = new Biquad();

  function updateCoeffs(){
    const low = parseFloat(lowCutInput.value);
    const high = parseFloat(highCutInput.value);
    hp.setHighpass(low, BUTTERWORTH_Q, SAMPLE_RATE);
    lp.setLowpass(high, BUTTERWORTH_Q, SAMPLE_RATE);
  }
  updateCoeffs();

  const rawBuf = new Float32Array(N);
  const filtBuf = new Float32Array(N);
  let phase1 = 0, phase2 = 0, drift = 0;

  function nextRawSample(noiseAmt){
    phase1 += 0.045;  // ~ periodic bump pattern
    phase2 += 0.11;
    drift += (Math.random() - 0.5) * 0.01;
    drift *= 0.995; // slow decay so it doesn't run away
    const signal = Math.sin(phase1) * 0.5 + Math.sin(phase2) * 0.18;
    const noise = (Math.random() - 0.5) * 2 * noiseAmt;
    return signal + drift + noise;
  }

  let writeIndex = 0;
  function step(){
    const noiseAmt = parseFloat(noiseInput.value);
    const raw = nextRawSample(noiseAmt);
    const stage1 = hp.process(raw);
    const filtered = lp.process(stage1);
    rawBuf[writeIndex % N] = raw;
    filtBuf[writeIndex % N] = filtered;
    writeIndex++;
  }

  // seed buffer so it's not empty on first paint
  for (let i = 0; i < N; i++) step();

  function computeRMS(buf){
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i]*buf[i];
    return Math.sqrt(sum / buf.length);
  }
  function computeVariance(buf){
    let mean = 0;
    for (let i = 0; i < buf.length; i++) mean += buf[i];
    mean /= buf.length;
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += (buf[i]-mean)*(buf[i]-mean);
    return sum / buf.length;
  }

  let w, h, dpr;
  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight || 280;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  function ordered(buf){
    // returns buffer in chronological order starting from oldest
    const out = new Float32Array(N);
    for (let i = 0; i < N; i++){
      out[i] = buf[(writeIndex + i) % N];
    }
    return out;
  }

  function draw(){
    ctx.clearRect(0, 0, w, h);
    const midY = h * 0.5;
    const scale = h * 0.22;

    const rawOrdered = ordered(rawBuf);
    const filtOrdered = ordered(filtBuf);

    plot(rawOrdered, '#565F6E', 1);
    plot(filtOrdered, '#4FD1C5', 1.8);

    function plot(buf, color, lineWidth){
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      for (let i = 0; i < buf.length; i++){
        const x = (i / (buf.length - 1)) * w;
        const y = midY - buf[i] * scale;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  function updateReadouts(){
    const recentN = SAMPLE_RATE; // last ~1s
    const rawRecent = rawBuf.slice(0, recentN);
    const filtRecent = filtBuf.slice(0, recentN);
    rmsRawEl.textContent = computeRMS(rawRecent).toFixed(3);
    rmsFilteredEl.textContent = computeRMS(filtRecent).toFixed(3);
    rollVarEl.textContent = computeVariance(filtRecent).toFixed(3);
  }

  function tick(){
    for (let i = 0; i < 6; i++) step(); // advance a few samples per frame
    draw();
    updateReadouts();
    if (!prefersReducedMotion) requestAnimationFrame(tick);
  }

  lowCutInput.addEventListener('input', () => {
    lowCutVal.textContent = `${lowCutInput.value} Hz`;
    updateCoeffs();
  });
  highCutInput.addEventListener('input', () => {
    highCutVal.textContent = `${highCutInput.value} Hz`;
    updateCoeffs();
  });
  noiseInput.addEventListener('input', () => {
    noiseAmtVal.textContent = noiseInput.value;
  });

  if (prefersReducedMotion) {
    draw();
    updateReadouts();
  } else {
    tick();
  }
})();

// ============================================================
// Contact form -> mailto fallback (no backend on a static site)
// ============================================================
(function initContactForm(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  const note = document.getElementById('contactNote');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n- ${name} (${email})`);
    window.location.href = `mailto:prajwalp2125@gmail.com?subject=${subject}&body=${body}`;
    note.textContent = 'Opening your email app…';
  });
})();
