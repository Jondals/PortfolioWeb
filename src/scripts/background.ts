/**
 * background.ts
 * Drives the page background (src/components/background.astro):
 *  - tracks which section is on screen and writes it to html[data-scene] so global.css can
 *    recolor the background through CSS custom properties,
 *  - moves the star layers and waves on scroll (parallax: higher scroll speed moves them further),
 *  - adds a subtle depth effect that follows the mouse (each layer shifts by a different amount).
 */

const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Scene: every section has its own colors (see html[data-scene] in global.css)
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

// Background movement: scroll (parallax on the stars, waves that rise, fall and change height)
// and the mouse (subtle depth: each layer shifts further the closer it is supposed to be)
const stars = document.querySelectorAll<HTMLElement>(".page-stars");
const waves = document.querySelectorAll<HTMLElement>(".page-wave-row");
const aurora = document.querySelector<HTMLElement>(".page-aurora");
const TILE = 600;
const finePointer = window.matchMedia("(pointer: fine)").matches;

// Normalized mouse position (-1..1) and the smoothed value actually used for drawing
let targetX = 0;
let targetY = 0;
let mouseX = 0;
let mouseY = 0;
let ticking = false;

/** Recomputes the transform of every background layer from the scroll position and the mouse. */
function update(): void {
  ticking = false;

  const y = window.scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = y / max;

  // The mouse position is smoothed so the background "floats" instead of jumping
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

  // Keep animating while the background has not caught up with the mouse yet
  if (Math.abs(targetX - mouseX) > 0.001 || Math.abs(targetY - mouseY) > 0.001) request();
}

/** Schedules `update` on the next animation frame, coalescing calls that happen in between. */
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

  // If the page loads already scrolled (reload or anchor link), position the background right away
  if (window.scrollY > 0) request();
}
