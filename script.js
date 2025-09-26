// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#bg"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Heart particles
const particles = 8000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particles * 3);
const randomPhase = new Float32Array(particles); // để lấp lánh

// Công thức khối trái tim 3D
function insideHeart(x, y, z) {
  let eq = Math.pow(x * x + y * y - 1, 3) - x * x * y * y * y;
  return eq <= 0;
}

let i = 0;
while (i < particles) {
  let x = (Math.random() * 2 - 1) * 2.5;
  let y = (Math.random() * 2 - 1) * 2.5;
  let z = (Math.random() * 2 - 1) * 2.5;
  if (insideHeart(x, y, z)) {
    positions[i * 3] = (Math.random() - 0.5) * 40;   // ban đầu random bay lên
    positions[i * 3 + 1] = -50 - Math.random() * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    randomPhase[i] = Math.random() * Math.PI * 2;
    i++;
  }
}
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// Target heart positions
const targetPositions = new Float32Array(particles * 3);
let j = 0;
while (j < particles) {
  let x = (Math.random() * 2 - 1) * 2.5;
  let y = (Math.random() * 2 - 1) * 2.5;
  let z = (Math.random() * 2 - 1) * 2.5;
  if (insideHeart(x, y, z)) {
    targetPositions[j * 3] = x * 6; // scale tim to
    targetPositions[j * 3 + 1] = y * 6;
    targetPositions[j * 3 + 2] = z * 6;
    j++;
  }
}

// Material hạt
const material = new THREE.PointsMaterial({
  color: 0xff66cc,
  size: 0.12,
  transparent: true,
  opacity: 0.9
});

const heart = new THREE.Points(geometry, material);
scene.add(heart);

camera.position.z = 50;

// Text xoay quanh
const loader = new THREE.FontLoader();
loader.load("https://cdn.jsdelivr.net/npm/three@0.150.1/examples/fonts/helvetiker_regular.typeface.json", function (font) {
  const textGeo = new THREE.TextGeometry("Em thích anh, làm người yêu em nhé ❤️", {
    font: font,
    size: 1.2,
    height: 0.1,
  });
  const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const textMesh = new THREE.Mesh(textGeo, textMat);
  textMesh.position.set(-15, -20, 0);
  scene.add(textMesh);

  // Animate xoay quanh tim
  function rotateText() {
    textMesh.rotation.y += 0.01;
    requestAnimationFrame(rotateText);
  }
  rotateText();
});

// Animation
let progress = 0;
function animate(time) {
  requestAnimationFrame(animate);
  const pos = heart.geometry.attributes.position.array;
  progress += 0.004;

  for (let k = 0; k < particles; k++) {
    // Bay từ dưới lên → vào tim
    pos[k * 3] += (targetPositions[k * 3] - pos[k * 3]) * progress * 0.02;
    pos[k * 3 + 1] += (targetPositions[k * 3 + 1] - pos[k * 3 + 1]) * progress * 0.02;
    pos[k * 3 + 2] += (targetPositions[k * 3 + 2] - pos[k * 3 + 2]) * progress * 0.02;

    // Lung linh nhấp nháy
    let sparkle = 0.6 + 0.4 * Math.sin(time * 0.002 + randomPhase[k]);
    material.opacity = sparkle;
  }

  heart.geometry.attributes.position.needsUpdate = true;

  // Xoay tim
  heart.rotation.y += 0.003;
  heart.rotation.x += 0.001;

  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
