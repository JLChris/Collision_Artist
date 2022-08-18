/**
 * Declare canvas variables
 */
const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");

const CANVAS_WIDTH = (canvas1.width = canvas2.width = 500);
const CANVAS_HEIGHT = (canvas1.height = canvas2.height = 700);

/**
 * Get settings controls from DOM
 */
const squareSizeSelect = document.getElementById("square-size");
const squareSizeDisplay = document.getElementById("square-size-display");
const squareSpeedSelect = document.getElementById("square-speed");
const squareSpeedDisplay = document.getElementById("square-speed-display");

const brushRandomizeCheckbox = document.getElementById("randomize");
const brushShapeSelect = document.getElementById("brush-shape");
const brushSizeSelect = document.getElementById("brush-size");
const brushSizeDisplay = document.getElementById("brush-size-display");
const brushSpeedSelect = document.getElementById("brush-speed");
const brushSpeedDisplay = document.getElementById("brush-speed-display");
const brushWiggleSelect = document.getElementById("brush-wiggle");
const brushWiggleDisplay = document.getElementById("brush-wiggle-display");

const playButton = document.getElementById("play-button");
const clearButton = document.getElementById("clear-button");

const numSquares = 20;
let gameFrame = 0;
let runAnimation = true;
let randomizeBrush = true;
let manualBrushShape = "all";
let manualBrushSize = 100;
let manualBrushSpeed = 1;
let manualBrushWiggle = 1;

class Square {
  constructor(speed, fill, canvas) {
    this.x = Math.random() * CANVAS_WIDTH;
    this.y = Math.random() * CANVAS_HEIGHT;
    this.width = 100;
    this.height = 100;
    this.goRight = true;
    this.goDown = true;
    this.speed = speed;
    this.fill = fill;
    this.canvas = canvas;
  }
  update() {
    this.x = this.goRight ? this.x + this.speed : this.x - this.speed;
    this.y = this.goDown ? this.y + this.speed : this.y - this.speed;
    if (this.x + this.width >= CANVAS_WIDTH) this.goRight = false;
    if (this.x <= 0) this.goRight = true;
    if (this.y + this.height >= CANVAS_HEIGHT) this.goDown = false;
    if (this.y <= 0) this.goDown = true;
  }
  draw() {
    ctx1.strokeRect(this.x, this.y, this.width, this.height);
  }
}

const shapes = ["rect", "circle"];

class Brush {
  constructor() {
    this.shape = shapes[Math.floor(Math.random() * 1.5)];
    this.x = Math.random() * CANVAS_WIDTH;
    this.y = Math.random() * CANVAS_HEIGHT;
    this.width = 100;
    this.height = 100;
    this.goRight = true;
    this.goDown = true;
    this.speed = 1;
    this.color = "black";
    this.angle = Math.random() * 5 + 0.1;
    this.wiggle = 0;
  }
  update() {
    this.x = this.goRight
      ? this.x + this.wiggle * (Math.random() * 2 - 1) + this.speed
      : this.x + this.wiggle * (Math.random() * 2 - 1) - this.speed;
    this.y = this.goDown
      ? this.y + this.wiggle * (Math.random() * 2 - 1) + this.speed * this.angle
      : this.y +
        this.wiggle * (Math.random() * 2 - 1) -
        this.speed * this.angle;
    if (this.x + this.width >= CANVAS_WIDTH) this.goRight = false;
    if (this.x <= 0) this.goRight = true;
    if (this.y + this.height >= CANVAS_HEIGHT) this.goDown = false;
    if (this.y <= 0) this.goDown = true;
  }
  draw() {
    if (this.shape === "rect") {
      ctx2.fillStyle = this.color;
      ctx2.fillRect(this.x, this.y, this.width, this.height);
    } else if (this.shape === "circle") {
      ctx2.fillStyle = this.color;
      ctx2.beginPath();
      ctx2.ellipse(
        this.x,
        this.y,
        this.width,
        this.height,
        Math.PI / 4,
        0,
        2 * Math.PI
      );
      ctx2.fill();
    }
  }
}

const square1 = new Square(1, false, 1);
const square2 = new Square(1.5, false, 1);
const brush = new Brush();

squareSizeSelect.addEventListener("change", function (e) {
  square1.width = Number(e.target.value);
  square1.height = Number(e.target.value);
  square2.width = Number(e.target.value);
  square2.height = Number(e.target.value);
  console.log(square1.width, square1.height);
  squareSizeDisplay.innerHTML = e.target.value;
});

squareSpeedSelect.addEventListener("change", function (e) {
  square1.speed = 1 * Number(e.target.value);
  square2.speed = 1.5 * Number(e.target.value);
  squareSpeedDisplay.innerHTML = e.target.value;
});

brushRandomizeCheckbox.addEventListener("change", function (e) {
  randomizeBrush = e.target.checked;
  console.log(randomizeBrush);
});

brushShapeSelect.addEventListener("change", function (e) {
  manualBrushShape = e.target.value;
});

brushSpeedSelect.addEventListener("change", function (e) {
  manualBrushSpeed = Number(e.target.value);
  brushSpeedDisplay.innerHTML = e.target.value;
});

brushSizeSelect.addEventListener("change", function (e) {
  manualBrushSize = Number(e.target.value);
  brushSizeDisplay.innerHTML = e.target.value;
});

brushWiggleSelect.addEventListener("change", function (e) {
  manualBrushWiggle = Number(e.target.value);
  brushWiggleDisplay.innerHTML = e.target.value;
});

playButton.addEventListener("click", function (e) {
  if (runAnimation) {
    runAnimation = false;
    playButton.innerHTML = "Paused";
  } else {
    runAnimation = true;
    playButton.innerHTML = "Running";
    animate();
  }
});

clearButton.addEventListener("click", function (e) {
  ctx2.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
});

function animate() {
  if (randomizeBrush) {
    brushShapeSelect.disabled = true;
    brushSizeSelect.disabled = true;
    brushSpeedSelect.disabled = true;
    brushWiggleSelect.disabled = true;
  } else {
    brushShapeSelect.disabled = false;
    brushSizeSelect.disabled = false;
    brushSpeedSelect.disabled = false;
    brushWiggleSelect.disabled = false;
  }
  ctx1.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  square1.update();
  square1.draw();
  square2.update();
  square2.draw();
  if (
    square1.x <= square2.x + square2.width &&
    square1.x + square1.width >= square2.x &&
    square1.y <= square2.y + square2.height &&
    square1.y + square1.height >= square2.y
  ) {
    brush.update();
    brush.draw();
  } else {
    if (randomizeBrush) {
      brush.color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.8 + 0.2})`;
      brush.shape = shapes[gameFrame % 2];
      brush.x = Math.random() * CANVAS_WIDTH;
      brush.y = Math.random() * CANVAS_HEIGHT;
      brush.width = Math.random() * 100 + 10;
      brush.height = Math.random() * 100 + 10;
      brush.speed = Math.random() * 20 + 1;
      brush.angle = Math.random() * 5 + 0.1;
      brush.wiggle = Math.random() * 100;
    } else {
      brush.color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.8 + 0.2})`;
      brush.shape =
        manualBrushShape === "all" ? shapes[gameFrame % 2] : manualBrushShape;
      brush.x = Math.random() * CANVAS_WIDTH;
      brush.y = Math.random() * CANVAS_HEIGHT;
      brush.width = Math.random() * manualBrushSize + 10;
      brush.height = Math.random() * manualBrushSize + 10;
      brush.speed = Math.random() * manualBrushSpeed + 1;
      brush.angle = Math.random() * 5 + 0.1;
      brush.wiggle = Math.random() * manualBrushWiggle;
    }
  }
  gameFrame++;
  if (runAnimation) {
    requestAnimationFrame(animate);
  }
}
animate();
