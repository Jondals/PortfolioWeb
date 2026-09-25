// Cursor propio: un orbe de luz exactamente en la posición del ratón, con una estela pegada a él
// (una sola forma rellena, suavizada y afinada). Solo con ratón y sin "reducir movimiento".
const finePointer = window.matchMedia("(pointer: fine)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface Point {
  x: number;
  y: number;
  time: number;
}

type RGB = [number, number, number];

const TRAIL_MS = 380;
// Igual que el diámetro del orbe: la estela sale de él con su mismo grosor y termina en pico
const MAX_WIDTH = 10;
const SPACING = 3;

if (finePointer && !reducedMotion) {
  const root = document.documentElement;
  const canvas = document.createElement("canvas");
  const orb = document.createElement("div");
  canvas.className = "cursor-trail";
  orb.className = "cursor-orb";
  canvas.setAttribute("aria-hidden", "true");
  orb.setAttribute("aria-hidden", "true");
  document.body.append(canvas, orb);

  const ctx = canvas.getContext("2d");
  const points: Point[] = [];
  let head: RGB = [34, 211, 238];
  let tail: RGB = [168, 85, 247];
  let running = false;
  let ready = false;
  let width = 0;
  let height = 0;


  // El lienzo mide exactamente la zona visible (sin la barra de scroll) para que coincida con el ratón
  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = root.clientWidth;
    height = root.clientHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function parseColor(value: string, fallback: RGB): RGB {
    const rgb = value.match(/\d+(\.\d+)?/g);
    if (value.startsWith("rgb") && rgb && rgb.length >= 3) return [Number(rgb[0]), Number(rgb[1]), Number(rgb[2])];

    const hex = value.replace("#", "");
    if (/^[0-9a-f]{6}$/i.test(hex)) return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB;
    return fallback;
  }

  function readColors(): void {
    const style = getComputedStyle(document.querySelector(".page-bg") ?? root);
    head = parseColor(style.getPropertyValue("--scene-a").trim(), head);
    tail = parseColor(style.getPropertyValue("--scene-b").trim(), tail);
    orb.style.setProperty("--orb", `rgb(${head.join(", ")})`);
  }

  const mix = (a: RGB, b: RGB, t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t)) as RGB;

  function prepare(): void {
    if (ready) return;
    ready = true;
    resize();
    readColors();
    root.classList.add("custom-cursor");
  }

  // Añade puntos intermedios para que la estela no tenga esquinas aunque el ratón vaya rápido
  function addPoint(x: number, y: number, time: number): void {
    const last = points[points.length - 1];
    if (last) {
      const distance = Math.hypot(x - last.x, y - last.y);
      const steps = Math.floor(distance / SPACING);
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        points.push({ x: last.x + (x - last.x) * t, y: last.y + (y - last.y) * t, time: last.time + (time - last.time) * t });
      }
    }
    points.push({ x, y, time });
    if (points.length > 240) points.splice(0, points.length - 240);
  }

  // Suavizado: media móvil de cada punto con sus vecinos
  function smooth(list: Point[]): Point[] {
    return list.map((p, i) => {
      const a = list[Math.max(0, i - 2)];
      const b = list[Math.max(0, i - 1)];
      const c = list[Math.min(list.length - 1, i + 1)];
      const d = list[Math.min(list.length - 1, i + 2)];
      return { x: (a.x + b.x + p.x * 2 + c.x + d.x) / 6, y: (a.y + b.y + p.y * 2 + c.y + d.y) / 6, time: p.time };
    });
  }

  function start(): void {
    if (running) return;
    running = true;
    requestAnimationFrame(draw);
  }

  function draw(now: number): void {
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    while (points.length && now - points[0].time > TRAIL_MS) points.shift();

    if (points.length > 2) {
      // La punta de la estela queda clavada en el centro del orbe
      const path = smooth(points);
      path[path.length - 1] = points[points.length - 1];
      const left: [number, number][] = [];
      const right: [number, number][] = [];

      // Bordes de la cinta: grosor que crece de la cola a la cabeza, perpendicular a la dirección
      for (let i = 0; i < path.length; i++) {
        const p = path[i];
        const prev = path[Math.max(0, i - 1)];
        const next = path[Math.min(path.length - 1, i + 1)];
        const angle = Math.atan2(next.y - prev.y, next.x - prev.x);
        const life = Math.max(0, 1 - (now - p.time) / TRAIL_MS);
        // Forma de gota: ancho completo junto al orbe y se afina hasta un pico
        const w = (MAX_WIDTH / 2) * Math.pow(i / (path.length - 1), 0.75) * life;
        left.push([p.x + Math.sin(angle) * w, p.y - Math.cos(angle) * w]);
        right.push([p.x - Math.sin(angle) * w, p.y + Math.cos(angle) * w]);
      }

      const first = path[0];
      const last = path[path.length - 1];
      const gradient = ctx.createLinearGradient(first.x, first.y, last.x, last.y);
      gradient.addColorStop(0, `rgba(${tail.join(", ")}, 0)`);
      gradient.addColorStop(0.55, `rgba(${mix(tail, head, 0.5).join(", ")}, 0.7)`);
      gradient.addColorStop(1, `rgba(${head.join(", ")}, 1)`);

      ctx.beginPath();
      ctx.moveTo(left[0][0], left[0][1]);
      for (const [x, y] of left) ctx.lineTo(x, y);
      for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.shadowColor = `rgba(${head.join(", ")}, 0.55)`;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (points.length) {
      requestAnimationFrame(draw);
    } else {
      running = false;
      ctx.clearRect(0, 0, width, height);
    }
  }

  window.addEventListener("resize", () => ready && resize());

  // Los colores de escena se animan durante 1,6 s: se leen al cambiar y al terminar la transición
  new MutationObserver(() => {
    if (!ready) return;
    readColors();
    setTimeout(readColors, 1700);
  }).observe(root, { attributes: true, attributeFilter: ["data-scene", "class"] });

  const interactive = "a, button, [role='button'], label, summary";

  document.addEventListener("pointermove", (e: PointerEvent) => {
    prepare();
    orb.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    root.classList.add("cursor-visible");
    const hovering = Boolean((e.target as Element | null)?.closest(interactive));
    root.classList.toggle("cursor-hover", hovering);

    // Con el anillo abierto (encima de un botón o enlace) no hay estela: queda solo el círculo
    if (hovering) {
      points.length = 0;
      return;
    }

    const now = performance.now();
    const events = e.getCoalescedEvents?.() ?? [];
    for (const ev of events.length ? events : [e]) addPoint(ev.clientX, ev.clientY, now);
    start();
  });

  document.addEventListener("pointerdown", () => root.classList.add("cursor-down"));
  document.addEventListener("pointerup", () => root.classList.remove("cursor-down"));
  root.addEventListener("pointerleave", () => root.classList.remove("cursor-visible"));
}
