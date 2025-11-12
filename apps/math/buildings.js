// buildings.js
export function initBuildings(canvas) {
  const sources = ["b1.png", "b2.png", "b3.png", "b4.png", "b5.png"];
  const images = [];
  const buildings = [];

  function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
  }

  function spawnBuilding() {
    if (images.length === 0) return;

    const img = images[randInt(0, images.length - 1)];
    const w = (img.naturalWidth || 80);
    const h = (img.naturalHeight || 160);
    const flip = randInt(0, 1) === 1;
    const y = canvas.height - h + randInt(0, 200);
    const x = canvas.width + randInt(0, canvas.width >> 2);
    const speed = randInt(1, 3); // integer px/frame

    buildings.push({ img, x, y, w, h, speed, flip });
  }

  // integer spawn gap
  let framesLeft = 0;
  function maybeSpawn() {
    framesLeft--;
    if (framesLeft <= 0) {
      spawnBuilding();
      framesLeft = randInt(10, 100);
    }
  }

  function updateAndDraw(ctx, boost) {
    // update
    for (let i = buildings.length - 1; i >= 0; i--) {
      const b = buildings[i];
      b.x -= (boost ? b.speed * 80 : b.speed);
      if (b.x + b.w < 0) buildings.splice(i, 1);
    }

    buildings.sort((a, b) => a.speed - b.speed);

    // draw
    for (const b of buildings) {
      if (b.flip) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(b.img, -(b.x + b.w), b.y, b.w, b.h);
        ctx.restore();
      } else {
        ctx.drawImage(b.img, b.x, b.y, b.w, b.h);
      }
    }
  }

  const ready = new Promise((resolve) => {
    let loaded = 0;
    const total = sources.length;
    sources.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === total) resolve();
      };
      img.src = src;
      images.push(img);
    });
  });

  return { buildings, ready, maybeSpawn, spawnBuilding, updateAndDraw };
}
