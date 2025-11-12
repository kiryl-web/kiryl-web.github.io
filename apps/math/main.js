// main.js
import { initHelicopter } from "helicopter.js";
import { initBuildings } from "buildings.js";

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d", { alpha: false });
ctx.imageSmoothingEnabled = false;

// init first so resize handler can call heli.onResize safely
const heli = initHelicopter(canvas);
const world = initBuildings(canvas);

function resizeCanvas() {
  const w = Math.floor(window.innerWidth);
  const h = Math.floor(window.innerHeight);
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (heli && heli.onResize) heli.onResize();
}

window.addEventListener("resize", resizeCanvas, { passive: true });
resizeCanvas();

let boost = false;
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") boost = true;
});
window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight") boost = false;
});

function renderFrame() {
  ctx.fillStyle = "#0a0a2d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  world.updateAndDraw(ctx, boost);
  heli.draw(ctx);
}

function tick() {
  world.maybeSpawn();
  renderFrame();
  requestAnimationFrame(tick);
}

Promise.all([heli.ready, world.ready]).then(() => {
  world.spawnBuilding();
  requestAnimationFrame(tick);
});
