const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hearts = [];

// Vẽ 1 trái tim nhỏ
function drawHeart(x, y, size, color, angle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(size, size);
  ctx.beginPath();
  ctx.moveTo(0, -2);
  ctx.bezierCurveTo(2, -4, 4, -1, 0, 3);
  ctx.bezierCurveTo(-4, -1, -2, -4, 0, -2);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

// Tạo các trái tim nhỏ thành khối hình trái tim
function createHeartShape() {
  let points = [];
  for (let t = 0; t < Math.PI; t += 0.05) {
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    points.push({ x, y });
  }

  for (let p of points) {
    hearts.push({
      x: canvas.width / 2 + p.x * 15,
      y: canvas.height / 2 + p.y * 15,
      size: Math.random() * 0.8 + 0.6,
      color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      angle: Math.random() * Math.PI,
      speed: (Math.random() - 0.5) * 0.02
    });
  }
}

// Animation
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hearts.forEach(h => {
    h.angle += h.speed;
    drawHeart(h.x, h.y, h.size, h.color, h.angle);
  });

  requestAnimationFrame(animate);
}

createHeartShape();
animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  hearts = [];
  createHeartShape();
});
