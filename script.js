// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#bg"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Tạo hạt
const particles = 4000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particles * 3);

// Vị trí ban đầu (bay từ dưới lên)
for (let i = 0; i < particles; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 40;   // x random
  positions[i * 3 + 1] = -50 - Math.random() * 50; // y dưới màn hình
  positions[i * 3 + 2] = (Math.random() - 0.5) * 40; // z random
}
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// Material
const material = new THREE.PointsMaterial({
  color: 0xff4da6,
  size: 0.15,
  transparent: true,
  opacity: 0.9,
});

// Tạo object hạt
const heart = new THREE.Points(geometry, material);
scene.add(heart);

camera.position.z = 40;

// Hàm công thức trái tim 2D rồi mở rộng sang 3D
function heartShape(t, s) {
  let x = 16 * Math.pow(Math.sin(t), 3);
  let y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  let z = s * 2;
  return [x * 0.6, y * 0.6, z];
}

// Mục tiêu trái tim (target positions)
const targetPositions = new Float32Array(particles * 3);
for (let i = 0; i < particles; i++) {
  let t = Math.random() * Math.PI * 2;
  let s = (Math.random() - 0.5) * 2;
  const [x, y, z] = heartShape(t, s);
  targetPositions[i * 3] = x;
  targetPositions[i * 3 + 1] = y;
  targetPositions[i * 3 + 2] = z;
}

// Animation
let progress = 0;
function animate() {
  requestAnimationFrame(animate);

  const pos = heart.geometry.attributes.position.array;
  progress += 0.005; // tốc độ bay

  for (let i = 0; i < particles; i++) {
    pos[i * 3] += (targetPositions[i * 3] - pos[i * 3]) * progress * 0.02;
    pos[i * 3 + 1] += (targetPositions[i * 3 + 1] - pos[i * 3 + 1]) * progress * 0.02;
    pos[i * 3 + 2] += (targetPositions[i * 3 + 2] - pos[i * 3 + 2]) * progress * 0.02;
  }

  heart.geometry.attributes.position.needsUpdate = true;

  // Xoay trái tim
  heart.rotation.y += 0.005;
  heart.rotation.x += 0.002;

  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
