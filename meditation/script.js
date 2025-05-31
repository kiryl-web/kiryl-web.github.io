(() => {
  const ITERATIONS = 12;
  const ITER_DURATION = 15000; // ms
  let left = ITERATIONS;
  let start = null, pausedAt = null, paused = false, raf = null;

  const bg = document.getElementById('background');
  const iterText = document.getElementById('iteration-text');
  const breathText = document.getElementById('breath-text');
  const pauseBtn = document.getElementById('pause-button');
  const overlay = document.getElementById('pause-overlay');
  const resumeBtn = document.getElementById('resume-button');
  const rect = document.getElementById('progress-rect');

  function isDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function lerp(c1, c2, t) {
    const p = (hex)=>parseInt(hex.slice(1),16),
          a = p(c1), b = p(c2),
          r1=a>>16, g1=(a>>8)&0xff, b1=a&0xff,
          r2=b>>16, g2=(b>>8)&0xff, b2=b&0xff,
          r=Math.round(r1+(r2-r1)*t),
          g=Math.round(g1+(g2-g1)*t),
          bb=Math.round(b1+(b2-b1)*t);
    return `rgb(${r},${g},${bb})`;
  }

  function bgColor(pct) {
    const darkCol = isDark() ? '#121212' : '#FFFFFF';
    const lightCol = isDark() ? '#003366' : '#FFFFFF';
    if (pct<25)      return lerp(darkCol, lightCol, pct/25);
    else if (pct<50) return lightCol;
    else if (pct<75) return lerp(lightCol, darkCol, (pct-50)/25);
    else              return darkCol;
  }

  function updateIter() {
    iterText.textContent = `Breaths left: ${left}`;
  }

  function updateBreath(p) {
    if      (p<=24) breathText.textContent = 'Inhale';
    else if (p<=49) breathText.textContent = 'Hold';
    else if (p<=75) breathText.textContent = 'Exhale';
    else             breathText.textContent = 'Hold';
  }

  function animate(ts) {
    if (paused) { pausedAt = ts; return; }
    if (!start) start = ts;
    const elapsed = ts - start;
    const pct = Math.min(elapsed/ITER_DURATION*100, 100);

    // background
    bg.style.backgroundColor = bgColor(pct);

    // SVG dashoffset: pathLength=1 → offset from 1→0
    rect.setAttribute('stroke-dashoffset', `${1 - pct/100}`);

    updateBreath(pct);

    if (pct < 100) {
      raf = requestAnimationFrame(animate);
    } else {
      left--;
      if (left > 0) {
        start = null;
        updateIter();
        raf = requestAnimationFrame(animate);
      } else {
        breathText.textContent = 'Done!';
        pauseBtn.disabled = true;
      }
    }
  }

  pauseBtn.addEventListener('click', () => {
    paused = true;
    cancelAnimationFrame(raf);
    overlay.classList.remove('hidden');
  });
  resumeBtn.addEventListener('click', () => {
    paused = false;
    overlay.classList.add('hidden');
    if (pausedAt) {
      const now = performance.now();
      start += (now - pausedAt);
      pausedAt = null;
    }
    raf = requestAnimationFrame(animate);
  });

  // start
  updateIter();
  raf = requestAnimationFrame(animate);
})();
