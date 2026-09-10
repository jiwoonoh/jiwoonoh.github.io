const scenes = [...document.querySelectorAll(".scene")];
const progressLabel = document.querySelector(".progress-label");
const progressFill = document.querySelector(".progress-fill");
const confettiLayer = document.querySelector(".confetti");
const startGate = document.getElementById("startGate");
const startButton = document.getElementById("startButton");
const musicDock = document.getElementById("musicDock");
const musicToggle = document.getElementById("musicToggle");
const musicMount = document.getElementById("musicMount");
let currentScene = 0;
let changing = false;
let musicPlaying = false;

function youtubeCommand(command) {
  const player = musicMount.querySelector("iframe");
  if (!player?.contentWindow) return;
  player.contentWindow.postMessage(JSON.stringify({ event: "command", func: command, args: [] }), "*");
}

function startMusic() {
  if (!musicMount.querySelector("iframe")) {
    const player = document.createElement("iframe");
    player.src = "https://www.youtube.com/embed/QWTGAL6Udak?autoplay=1&loop=1&playlist=QWTGAL6Udak&controls=0&playsinline=1&enablejsapi=1";
    player.title = "Tishomingo by Zach Bryan — official YouTube audio";
    player.allow = "autoplay; encrypted-media";
    musicMount.appendChild(player);
  } else {
    youtubeCommand("playVideo");
  }
  musicPlaying = true;
  musicDock.classList.remove("is-paused");
  musicToggle.textContent = "Ⅱ";
  musicToggle.setAttribute("aria-label", "Pause Tishomingo");
  musicToggle.title = "Pause music";
}

startButton.addEventListener("click", () => {
  startMusic();
  startGate.classList.add("is-open");
  musicDock.classList.add("is-visible");
  musicDock.setAttribute("aria-hidden", "false");
  window.setTimeout(() => startGate.remove(), 900);
});

musicToggle.addEventListener("click", () => {
  if (musicPlaying) {
    youtubeCommand("pauseVideo");
    musicPlaying = false;
    musicDock.classList.add("is-paused");
    musicToggle.textContent = "▶";
    musicToggle.setAttribute("aria-label", "Play Tishomingo");
    musicToggle.title = "Play music";
  } else {
    startMusic();
  }
});

const requestedScene = Number(new URLSearchParams(window.location.search).get("scene"));
if (Number.isInteger(requestedScene) && requestedScene > 0 && requestedScene < scenes.length) {
  scenes[0].classList.remove("is-active");
  scenes[0].setAttribute("aria-hidden", "true");
  scenes[requestedScene].classList.add("is-active");
  scenes[requestedScene].setAttribute("aria-hidden", "false");
  currentScene = requestedScene;
  progressLabel.textContent = `${String(currentScene + 1).padStart(2, "0")} / 04`;
  progressFill.style.width = `${(currentScene + 1) * 25}%`;
}

function showScene(nextIndex) {
  if (changing || nextIndex === currentScene || nextIndex < 0 || nextIndex >= scenes.length) return;
  changing = true;

  const current = scenes[currentScene];
  const next = scenes[nextIndex];
  current.classList.add("is-leaving");
  current.classList.remove("is-active");
  current.setAttribute("aria-hidden", "true");

  window.setTimeout(() => {
    current.classList.remove("is-leaving");
    next.classList.add("is-active");
    next.setAttribute("aria-hidden", "false");
    currentScene = nextIndex;
    progressLabel.textContent = `${String(currentScene + 1).padStart(2, "0")} / 04`;
    progressFill.style.width = `${(currentScene + 1) * 25}%`;
    changing = false;

    if (currentScene === 3) window.setTimeout(celebrate, 500);
  }, 330);
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showScene(currentScene + 1));
});

document.querySelectorAll("[data-go]").forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();
    showScene(Number(control.dataset.go));
  });
});

document.addEventListener("keydown", (event) => {
  if (["ArrowRight", "Enter", " "].includes(event.key) && currentScene < scenes.length - 1) {
    if (event.target.tagName !== "BUTTON") showScene(currentScene + 1);
  }
  if (event.key === "ArrowLeft" && currentScene > 0) showScene(currentScene - 1);
});

function celebrate() {
  const colors = ["#ecaa88", "#d9a743", "#f2e5c9", "#a4412b", "#66755a"];
  for (let index = 0; index < 90; index += 1) {
    const piece = document.createElement("i");
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--fall", `${2.7 + Math.random() * 2.7}s`);
    piece.style.setProperty("--drift", `${-120 + Math.random() * 240}px`);
    piece.style.setProperty("--turn", `${Math.random() * 180}deg`);
    piece.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
    piece.style.animationDelay = `${Math.random() * .8}s`;
    piece.style.borderRadius = Math.random() > .65 ? "50%" : "2px";
    confettiLayer.appendChild(piece);
    window.setTimeout(() => piece.remove(), 6200);
  }
}

document.getElementById("celebrateBtn").addEventListener("click", celebrate);
