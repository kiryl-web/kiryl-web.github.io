// script.js
document.body.requestFullscreen();
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const PIXEL_SIZE = 10;
const GRID_WIDTH = canvas.width / PIXEL_SIZE;
const GRID_HEIGHT = canvas.height / PIXEL_SIZE;

let redPixelX = Math.floor(GRID_WIDTH / 2);
let redPixelY = Math.floor(GRID_HEIGHT / 2);
let delay = 100;
let competitionMode = false;
const directions = [
    { dx: 1, dy: 0 }, // Right
    { dx: -1, dy: 0 }, // Left
    { dx: 0, dy: 1 }, // Down
    { dx: 0, dy: -1 } // Up
];
const randomPixels = [];

const blackColor = 'black';
const whiteColor = 'white';
const redColor = 'red';

const pixelGrid = Array.from({ length: GRID_WIDTH }, () => Array(GRID_HEIGHT).fill(blackColor));

function drawPixel(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
}

function drawGrid() {
    for (let x = 0; x < GRID_WIDTH; x++) {
        for (let y = 0; y < GRID_HEIGHT; y++) {
            drawPixel(x, y, pixelGrid[x][y]);
        }
    }
    drawPixel(redPixelX, redPixelY, redColor);
    randomPixels.forEach(pixel => drawPixel(pixel.x, pixel.y, pixel.color));
}

function moveRedPixel() {
    if (competitionMode) {
        pixelGrid[redPixelX][redPixelY] = whiteColor;
    } else {
        if (pixelGrid[redPixelX][redPixelY] === blackColor) {
            pixelGrid[redPixelX][redPixelY] = whiteColor;
        } else if (!competitionMode && pixelGrid[redPixelX][redPixelY] === whiteColor) {
            pixelGrid[redPixelX][redPixelY] = blackColor;
        }
    }

    const direction = directions[Math.floor(Math.random() * directions.length)];
    redPixelX = (redPixelX + direction.dx + GRID_WIDTH) % GRID_WIDTH;
    redPixelY = (redPixelY + direction.dy + GRID_HEIGHT) % GRID_HEIGHT;
}

function moveRandomPixels() {
    randomPixels.forEach(pixel => {
        if (competitionMode) {
            pixelGrid[pixel.x][pixel.y] = pixel.targetColor;
        } else {
            const currentColor = pixelGrid[pixel.x][pixel.y];
            if (currentColor === blackColor) {
                pixelGrid[pixel.x][pixel.y] = pixel.targetColor;
            } else if (!competitionMode && currentColor !== redColor) {
                pixelGrid[pixel.x][pixel.y] = blackColor;
            }
        }

        const direction = directions[Math.floor(Math.random() * directions.length)];
        pixel.x = (pixel.x + direction.dx + GRID_WIDTH) % GRID_WIDTH;
        pixel.y = (pixel.y + direction.dy + GRID_HEIGHT) % GRID_HEIGHT;
    });
}

function addRandomPixel() {
    const x = Math.floor(Math.random() * GRID_WIDTH);
    const y = Math.floor(Math.random() * GRID_HEIGHT);
    const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    const targetColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    randomPixels.push({ x, y, color, targetColor });
}

function reset() {
    for (let x = 0; x < GRID_WIDTH; x++) {
        for (let y = 0; y < GRID_HEIGHT; y++) {
            pixelGrid[x][y] = blackColor;
        }
    }

    randomPixels.length = 0;
    redPixelX = Math.floor(GRID_WIDTH / 2);
    redPixelY = Math.floor(GRID_HEIGHT / 2);
    competitionMode = false;
}

function increaseDelay() {
    delay = 100;
}

function decreaseDelay() {
    delay = 0;
}

function normalDelay() {
    delay = 50;
}

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'Escape':
            window.close();
            break;
        case 'KeyT':
            competitionMode = !competitionMode;
            break;
        case 'KeyN':
            addRandomPixel();
            break;
        case 'KeyC':
            reset();
            break;
        case 'KeyF':
            increaseDelay();
            break;
        case 'KeyG':
            normalDelay();
            break;
        case 'KeyH':
            decreaseDelay();
            break;
    }
});

function gameLoop() {
    moveRedPixel();
    moveRandomPixels();
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    setTimeout(gameLoop, delay);
}

gameLoop();
