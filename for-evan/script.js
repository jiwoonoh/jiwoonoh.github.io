const scenes = [...document.querySelectorAll(".scene")];
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const confettiLayer = document.getElementById("confetti");
const backgroundMusic = document.getElementById("backgroundMusic");

let currentScene = 0;
let experienceStarted = false;
let musicPlaying = false;

backgroundMusic.volume = 0.55;

function setMusicState(isPlaying) {
  musicPlaying = isPlaying;
  musicIcon.textContent = isPlaying ? "Ⅱ" : "▶";
  musicButton.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} Tishomingo`);
}

function playMusic() {
  backgroundMusic.play()
    .then(() => setMusicState(true))
    .catch(() => setMusicState(false));
}

startButton.addEventListener("click", () => {
  experienceStarted = true;
  playMusic();
  startScreen.classList.add("open");
  musicButton.hidden = false;
  window.setTimeout(() => startScreen.remove(), 650);
});

musicButton.addEventListener("click", () => {
  if (musicPlaying) {
    backgroundMusic.pause();
  } else {
    playMusic();
  }
});

backgroundMusic.addEventListener("play", () => setMusicState(true));
backgroundMusic.addEventListener("pause", () => setMusicState(false));

function showScene(nextIndex) {
  if (nextIndex < 0 || nextIndex >= scenes.length || nextIndex === currentScene) return;
  scenes[currentScene].classList.remove("active");
  scenes[currentScene].setAttribute("aria-hidden", "true");
  scenes[nextIndex].classList.add("active");
  scenes[nextIndex].setAttribute("aria-hidden", "false");
  currentScene = nextIndex;
  if (currentScene === scenes.length - 1) window.setTimeout(celebrate, 350);
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showScene(currentScene + 1));
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showScene(Number(button.dataset.go)));
});

document.addEventListener("keydown", (event) => {
  if (!experienceStarted) return;
  if (event.key === "ArrowRight" && currentScene < scenes.length - 1) showScene(currentScene + 1);
  if (event.key === "ArrowLeft" && currentScene > 0) showScene(currentScene - 1);
});

function celebrate() {
  const colors = ["#ffffff", "#d8a34b", "#b65c43", "#e6a582"];
  for (let index = 0; index < 70; index += 1) {
    const piece = document.createElement("i");
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--fall", `${2.5 + Math.random() * 2.5}s`);
    piece.style.setProperty("--drift", `${-100 + Math.random() * 200}px`);
    piece.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
    piece.style.animationDelay = `${Math.random() * .5}s`;
    confettiLayer.appendChild(piece);
    window.setTimeout(() => piece.remove(), 5500);
  }
}

document.getElementById("celebrateButton").addEventListener("click", celebrate);
