const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Escena: cada sección tiene sus colores (ver html[data-scene] en global.css)
const scenes = document.querySelectorAll<HTMLElement>("main section[id], footer[id]");

const sceneObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) root.dataset.scene = entry.target.id;
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

scenes.forEach((section) => sceneObserver.observe(section));

// Movimiento del fondo: con el scroll (paralaje de estrellas y ondas que suben, bajan y cambian de altura)
// y con el ratón (profundidad sutil: cada capa se desplaza más cuanto más cerca está)
const stars = document.querySelectorAll<HTMLElement>(".page-stars");
const waves = document.querySelectorAll<HTMLElement>(".page-wave-row");
const aurora = document.querySelector<HTMLElement>(".page-aurora");
const TILE = 600;
const finePointer = window.matchMedia("(pointer: fine)").matches;

// Posición del ratón normalizada (-1..1) y la suavizada que se usa para pintar
let targetX = 0;
let targetY = 0;
let mouseX = 0;
let mouseY = 0;
let ticking = false;

function update(): void {
  ticking = false;

  const y = window.scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = y / max;

  // El ratón se sigue con suavidad para que el fondo "flote" en vez de saltar
  mouseX += (targetX - mouseX) * 0.06;
  mouseY += (targetY - mouseY) * 0.06;

  stars.forEach((layer) => {
    const speed = Number(layer.dataset.speed ?? 0.1);
    const depth = speed * 120;
    const x = -mouseX * depth;
    const scroll = -((y * speed) % TILE) - mouseY * depth;
    layer.style.transform = `translate3d(${x.toFixed(2)}px, ${scroll.toFixed(2)}px, 0)`;
  });

  waves.forEach((wave, i) => {
    const depth = 10 + i * 6;
    const shift = Math.sin(y / 700 + i * 1.3) * 32 - mouseY * depth;
    const stretch = 1 + 0.3 * Math.sin(y / 1100 + i * 0.9) + mouseX * 0.04 * (i % 2 ? 1 : -1);
    wave.style.transform = `translate3d(${(-mouseX * depth).toFixed(2)}px, ${shift.toFixed(2)}px, 0) scaleY(${stretch.toFixed(3)})`;
  });

  if (aurora) {
    const ax = -progress * 45 + mouseX * 4;
    const ay = progress * 35 + mouseY * 4;
    aurora.style.transform = `translate3d(${ax.toFixed(2)}vw, ${ay.toFixed(2)}vh, 0) scale(${(1 + progress * 0.3).toFixed(3)})`;
  }

  // Mientras el fondo no ha alcanzado al ratón, sigue animando
  if (Math.abs(targetX - mouseX) > 0.001 || Math.abs(targetY - mouseY) > 0.001) request();
}

function request(): void {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(update);
}

if (!reducedMotion) {
  window.addEventListener("scroll", request, { passive: true });

  if (finePointer) {
    document.addEventListener("pointermove", (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
      request();
    });
  }

  // Si la página se abre ya desplazada (recarga o ancla), se coloca el fondo sin esperar al scroll
  if (window.scrollY > 0) request();
}
