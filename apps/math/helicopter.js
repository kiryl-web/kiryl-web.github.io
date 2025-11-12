// helicopter.js
export function initHelicopter(canvas) {
  const ctx = canvas.getContext("2d", { alpha: false }); // not used further; ensures identical context options

  const heli = {
    img: null,
    x: 40,
    y: 0,
    w: 0,
    h: 0,
    dragging: false,
    dragOffsetY: 0
  };

  function clamp(v, lo, hi) {
    if (v < lo) return lo;
    if (v > hi) return hi;
    return v;
  }

  // pointer controls: vertical drag
  function onPointerDown(e) {
    if (!heli.img) return;
    const cx = Math.floor(e.clientX);
    const cy = Math.floor(e.clientY);
    if (cx >= heli.x && cx < heli.x + heli.w && cy >= heli.y && cy < heli.y + heli.h) {
      heli.dragging = true;
      heli.dragOffsetY = cy - heli.y;
      canvas.setPointerCapture(e.pointerId);
    }
  }
  function onPointerMove(e) {
    if (!heli.dragging) return;
    const cy = Math.floor(e.clientY);
    const newY = cy - heli.dragOffsetY;
    heli.y = clamp(newY, 0, canvas.height - heli.h);
  }
  function onPointerUp(e) {
    if (heli.dragging) {
      heli.dragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) { }
    }
  }
  function onPointerCancel() {
    heli.dragging = false;
  }

  // keyboard controls: ArrowUp/ArrowDown and +/- adjust Y
  const KEY_STEP = 10; // integer step
  function onKeyDown(e) {
    if (!heli.img) return;
    let dy = 0;
    if (e.key === "ArrowUp") dy = -KEY_STEP;
    else if (e.key === "ArrowDown") dy = KEY_STEP;
    else if (e.key === "+" || (e.key === "=" && e.shiftKey)) dy = -KEY_STEP; // plus
    else if (e.key === "-") dy = KEY_STEP; // minus
    if (dy !== 0) {
      e.preventDefault();
      heli.y = clamp(heli.y + dy, 0, canvas.height - heli.h);
    }
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);
  window.addEventListener("keydown", onKeyDown);

  const ready = new Promise((resolve) => {
    const heliImg = new Image();
    heliImg.onload = () => {
      heli.img = heliImg;
      heli.w = heliImg.naturalWidth || 96;
      heli.h = heliImg.naturalHeight || 48;
      heli.y = clamp((canvas.height >> 1) - (heli.h >> 1), 0, canvas.height - heli.h);
      resolve();
    };
    heliImg.src = "helicopter.png";
  });

  function draw(ctx) {
    if (heli.img) {
      ctx.drawImage(heli.img, heli.x, heli.y, heli.w, heli.h);
    }
  }

  function onResize() {
    if (heli.img) {
      heli.y = clamp(heli.y, 0, canvas.height - heli.h);
    }
  }

  return { heli, ready, draw, onResize };
}
