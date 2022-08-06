const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");

const CANVAS_WIDTH = (canvas1.width = canvas2.width = 400);
const CANVAS_HEIGHT = (canvas1.height = canvas2.height = 800);

const numSquares = 20;
let gameFrame = 0;

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
    this.texture = 2;
  }
  update() {
    this.x = this.goRight
      ? this.x + this.speed * (1 + Math.random() * this.texture)
      : this.x - this.speed * (1 + Math.random() * this.texture);
    this.y = this.goDown
      ? this.y + this.speed * this.angle * (1 + Math.random() * this.texture)
      : this.y - this.speed * this.angle * (1 + Math.random() * this.texture);
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

function animate() {
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
    brush.color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, ${Math.random()})`;
    brush.shape = shapes[gameFrame % 2];
    brush.x = Math.random() * CANVAS_WIDTH;
    brush.y = Math.random() * CANVAS_HEIGHT;
    brush.width = Math.random() * 50 + 10;
    brush.height = Math.random() * 50 + 10;
    brush.speed = Math.random() * 5 + 1;
    brush.angle = Math.random() * 5 + 0.1;
    brush.texture = Math.random() * 2;
  }
  gameFrame++;
  requestAnimationFrame(animate);
}

animate();