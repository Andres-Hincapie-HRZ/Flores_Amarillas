/* =========================================================
   Carta -> Flores
   Al tocar la carta: se voltea, sale la hoja y pasa solo
   a la página de las flores. Sin botón.
   ========================================================= */

const envelope = document.getElementById("envelope");
const music = document.getElementById("bg-music");
const statusText = document.getElementById("status");
const pageFade = document.getElementById("pageFade");

const NEXT_PAGE = "index1.html";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Tiempos alineados con la animación del CSS (--duration: 900ms)
   0ms      -> el sobre gira
   675ms    -> se abre el pliegue
   1125ms   -> empieza a salir la hoja
   ~2025ms  -> la hoja ya está afuera                                  */
const T = reduceMotion
  ? { letterOut: 1100, status: 1200, fade: 1900, go: 2450 }
  : { letterOut: 2100, status: 2250, fade: 3900, go: 4550 };

let opened = false;
let letterIsOut = false;
const timers = [];

const later = (fn, ms) => timers.push(setTimeout(fn, ms));

function playMusic() {
  if (!music) return;
  music.volume = 0;
  const p = music.play();
  if (p && typeof p.catch === "function") {
    p.catch(() => {
      /* el navegador puede bloquear el autoplay; no rompe nada */
    });
  }
  // fade-in suave del volumen
  let v = 0;
  const fadeIn = setInterval(() => {
    v = Math.min(1, v + 0.05);
    music.volume = v;
    if (v >= 1) clearInterval(fadeIn);
  }, 60);
}

function goToFlowers() {
  timers.forEach(clearTimeout);
  pageFade.classList.add("show");
  setTimeout(() => {
    window.location.href = NEXT_PAGE;
  }, reduceMotion ? 120 : 550);
}

function openLetter() {
  if (opened) return;
  opened = true;

  envelope.classList.add("open");
  envelope.setAttribute("aria-disabled", "true");
  playMusic();

  if (!reduceMotion) rainHearts(2200);

  later(() => { letterIsOut = true; }, T.letterOut);
  later(() => statusText.classList.add("show"), T.status);
  later(() => pageFade.classList.add("show"), T.fade);
  later(() => { window.location.href = NEXT_PAGE; }, T.go);
}

/* --- Interacción --- */
envelope.addEventListener("click", () => {
  if (!opened) {
    openLetter();
  } else if (letterIsOut) {
    // Segundo toque: pasa a las flores de inmediato
    goToFlowers();
  }
});

envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    envelope.click();
  }
});

/* --- 🌸 Lluvia de corazones --- */
function rainHearts(duration) {
  const interval = setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "❤️";
    heart.style.left = Math.random() * 96 + "vw";
    heart.style.fontSize = Math.random() * 18 + 14 + "px";
    heart.style.animationDuration = Math.random() * 1.2 + 2.6 + "s";

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 4200);
  }, 180);

  setTimeout(() => clearInterval(interval), duration);
}
