const btnStart = document.getElementById("btn-start-camera");
const btnExit = document.getElementById("btn-exit-camera");
const video = document.getElementById("video");
const btnSnapshot = document.getElementById("take-snapshot");
const canvasSnapshot = document.getElementById("canvas");
const dataurl = document.getElementById("dataurl");
const dataurlContainer = document.getElementById("dataurl-container");

btnSnapshot.style.display = "none";
video.style.display = "none";
dataurlContainer.style.display = "none";
btnExit.style.display = "none";  // hide exit button initially

btnStart.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.style.display = "block";

    btnStart.style.display = "none";
    btnSnapshot.style.display = "inline-block";
    btnExit.style.display = "inline-block";  // show exit button on start

    dataurlContainer.style.display = "none";  // hide old snapshot data
  } catch (err) {
    alert("Could not access the camera. Error: " + err.message);
  }
});

btnExit.addEventListener("click", () => {
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }

  video.style.display = "none";
  btnExit.style.display = "none";
  btnSnapshot.style.display = "none";
  btnStart.style.display = "inline-block";

  dataurlContainer.style.display = "none";
});

// ... your existing snapshot event listener etc

btnSnapshot.addEventListener("click", () => {
  const ctx = canvasSnapshot.getContext("2d");
  canvasSnapshot.width = video.videoWidth || 500;
  canvasSnapshot.height = video.videoHeight || 400;
  ctx.drawImage(video, 0, 0, canvasSnapshot.width, canvasSnapshot.height);

  const imageDataUrl = canvasSnapshot.toDataURL("image/jpeg");
  dataurl.value = imageDataUrl;
  dataurlContainer.style.display = "block";
});

// --- STARFIELD & PLANETS SETUP ---

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

// Resize canvas to fill window
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const stars = [];
const STAR_COUNT = 900;
const starSpeed = 0.02;

for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: (Math.random() - 0.5) * canvas.width,
    y: (Math.random() - 0.5) * canvas.height,
    z: Math.random() * canvas.width
  });
}

const planets = [];

function createPlanet() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 60 + Math.random() * 120,
    speedX: (Math.random() * 0.3 - 0.15),
    speedY: (Math.random() * 0.3 - 0.15),
    color: `hsla(${Math.random() * 360}, 70%, 60%, 0.25)`
  };
}

for (let i = 0; i < 3; i++) {
  planets.push(createPlanet());
}

const moon = {
  x: canvas.width * 0.75,
  y: canvas.height * 0.25,
  radius: 120,
  rotation: 0,
  rotationSpeed: 0.002,
  color: "#cfcfcf",
};

function drawMoon() {
  const { x, y, radius, rotation, color } = moon;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  const gradient = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
  gradient.addColorStop(0.7, color);
  gradient.addColorStop(1, "rgba(0,0,0,0.3)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(0,0,0,0.15)";
  const craterPositions = [
    { x: -radius * 0.3, y: -radius * 0.2, r: radius * 0.15 },
    { x: radius * 0.25, y: -radius * 0.1, r: radius * 0.12 },
    { x: radius * 0.1, y: radius * 0.3, r: radius * 0.1 },
    { x: -radius * 0.15, y: radius * 0.25, r: radius * 0.08 },
  ];

  craterPositions.forEach(pos => {
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y, pos.r * 1.2, pos.r, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  const glowGradient = ctx.createRadialGradient(0, 0, radius * 0.9, 0, 0, radius * 1.4);
  glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
  glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let star of stars) {
    star.z -= starSpeed * canvas.width * 0.02;

    if (star.z <= 1) {
      star.x = (Math.random() - 0.5) * canvas.width;
      star.y = (Math.random() - 0.5) * canvas.height;
      star.z = canvas.width;
    }

    const k = 128 / star.z;
    const sx = star.x * k + canvas.width / 2;
    const sy = star.y * k + canvas.height / 2;

    if (sx < 0 || sx >= canvas.width || sy < 0 || sy >= canvas.height) continue;

    const size = (1 - star.z / canvas.width) * 3;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let p of planets) {
    p.x += p.speedX * 0.6;
    p.y += p.speedY * 0.6;

    if (p.x < -p.radius) p.x = canvas.width + p.radius;
    if (p.x > canvas.width + p.radius) p.x = -p.radius;
    if (p.y < -p.radius) p.y = canvas.height + p.radius;
    if (p.y > canvas.height + p.radius) p.y = -p.radius;

    const gradient = ctx.createRadialGradient(
      p.x, p.y, p.radius * 0.2,
      p.x, p.y, p.radius
    );
    gradient.addColorStop(0, p.color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  moon.rotation += moon.rotationSpeed;
  drawMoon();

  requestAnimationFrame(animate);
}



animate();
