/**
 * trail.ts
 * Custom cursor: a small glowing orb placed exactly at the mouse position, with a comet-like trail
 * attached to it (one continuous tapered shape, smoothed so it never looks jagged). Mouse only, and
 * disabled when the system asks to reduce motion.
 */

const finePointer = window.matchMedia("(pointer: fine)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface Point {
  x: number;
  y: number;
  time: number;
}

type RGB = [number, number, number];

const TRAIL_MS = 380;
// Same as the orb's diameter: the trail leaves it at full width and tapers down to a point
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
  // Off-screen layer: the trail is drawn here fully opaque, then the whole thing is composited
  // onto the visible canvas in one pass together with the glow
  const layer = document.createElement("canvas");
  const lctx = layer.getContext("2d");
  const points: Point[] = [];
  let head: RGB = [34, 211, 238];
  let tail: RGB = [168, 85, 247];
  let running = false;
  let ready = false;
  let width = 0;
  let height = 0;
  let dpr = 1;

  /** Sizes the canvases to the visible viewport (no scrollbar) so drawing matches the real mouse position. */
  function resize(): void {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = root.clientWidth;
    height = root.clientHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = layer.width = Math.round(width * dpr);
    canvas.height = layer.height = Math.round(height * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    lctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /** Parses an `rgb()` string or a `#rrggbb` hex color into an [r, g, b] tuple. */
  function parseColor(value: string, fallback: RGB): RGB {
    const rgb = value.match(/\d+(\.\d+)?/g);
    if (value.startsWith("rgb") && rgb && rgb.length >= 3) return [Number(rgb[0]), Number(rgb[1]), Number(rgb[2])];

    const hex = value.replace("#", "");
    if (/^[0-9a-f]{6}$/i.test(hex)) return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB;
    return fallback;
  }

  /** Reads the current scene colors (--scene-a / --scene-b, see global.css) and updates the orb color. */
  function readColors(): void {
    const style = getComputedStyle(document.querySelector(".page-bg") ?? root);
    head = parseColor(style.getPropertyValue("--scene-a").trim(), head);
    tail = parseColor(style.getPropertyValue("--scene-b").trim(), tail);
    orb.style.setProperty("--orb", `rgb(${head.join(", ")})`);
  }

  const mix = (a: RGB, b: RGB, t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t)) as RGB;

  /** First-use setup: sizes the canvases, reads the colors and switches on the custom cursor. */
  function prepare(): void {
    if (ready) return;
    ready = true;
    resize();
    readColors();
    root.classList.add("custom-cursor");
  }

  /** Adds a point to the trail, inserting intermediate points so fast mouse moves stay smooth. */
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

  /** Smooths the trail with a moving average of each point and its neighbors. */
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

  /** Draws one frame of the trail: builds the tapered path, paints it on the off-screen layer, composites it. */
  function draw(now: number): void {
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    while (points.length && now - points[0].time > TRAIL_MS) points.shift();

    if (points.length > 2 && lctx) {
      // The tip of the trail is pinned to the orb's current center
      const path = smooth(points);
      path[path.length - 1] = points[points.length - 1];
      const n = path.length - 1;

      // Only the rectangle the trail actually occupies is touched (plus margin for the glow): much cheaper
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const p of path) {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      }
      const pad = MAX_WIDTH + 24;
      const bx = Math.max(0, Math.floor(minX - pad));
      const by = Math.max(0, Math.floor(minY - pad));
      const bw = Math.min(width, Math.ceil(maxX + pad)) - bx;
      const bh = Math.min(height, Math.ceil(maxY + pad)) - by;

      // Same look as the original trail: color and opacity fade out towards the tail.
      // It is painted as a chain of segments (so it never breaks when the path crosses itself) that
      // butt up against each other with no overlap, so transparency never stacks at the joints
      lctx.clearRect(bx, by, bw, bh);
      lctx.lineCap = "butt";
      lctx.lineJoin = "round";

      // Color and opacity along the trail (0 = tail, 1 = orb), matching the original gradient
      const style = (t: number): string => {
        if (t < 0.55) {
          const k = t / 0.55;
          return `rgba(${mix(tail, mix(tail, head, 0.5), k).join(", ")}, ${(0.7 * k).toFixed(3)})`;
        }
        const k = (t - 0.55) / 0.45;
        return `rgba(${mix(mix(tail, head, 0.5), head, k).join(", ")}, ${(0.7 + 0.3 * k).toFixed(3)})`;
      };

      const GROUP = 4;
      for (let i = 1; i < n; i += GROUP) {
        const end = Math.min(n - 1, i + GROUP - 1);
        const mid = path[Math.min(n - 1, i + Math.floor(GROUP / 2))];
        const t = (i + end) / 2 / n;
        const life = Math.max(0, 1 - (now - mid.time) / TRAIL_MS);

        // Teardrop shape: full width next to the orb, tapering down to a point
        lctx.lineWidth = Math.max(0.4, MAX_WIDTH * Math.pow(t, 0.75) * life);
        lctx.strokeStyle = style(t);
        lctx.beginPath();
        lctx.moveTo((path[i - 1].x + path[i].x) / 2, (path[i - 1].y + path[i].y) / 2);
        for (let j = i; j <= end; j++) {
          const p = path[j];
          const next = path[j + 1];
          lctx.quadraticCurveTo(p.x, p.y, (p.x + next.x) / 2, (p.y + next.y) / 2);
        }
        lctx.stroke();
      }

      // Last segment, connecting to the orb's center
      const beforeLast = path[n - 1];
      const last = path[n];
      lctx.lineCap = "round";
      lctx.lineWidth = MAX_WIDTH;
      lctx.strokeStyle = `rgb(${head.join(", ")})`;
      lctx.beginPath();
      lctx.moveTo((beforeLast.x + last.x) / 2, (beforeLast.y + last.y) / 2);
      lctx.lineTo(last.x, last.y);
      lctx.stroke();

      if (bw > 0 && bh > 0) {
        ctx.save();
        ctx.shadowColor = `rgba(${head.join(", ")}, 0.55)`;
        ctx.shadowBlur = 12;
        ctx.drawImage(layer, bx * dpr, by * dpr, bw * dpr, bh * dpr, bx, by, bw, bh);
        ctx.restore();
      }
    }

    if (points.length) {
      requestAnimationFrame(draw);
    } else {
      running = false;
      ctx.clearRect(0, 0, width, height);
    }
  }

  window.addEventListener("resize", () => ready && resize());

  // Scene colors animate over 1.6s: read them on change and again once the transition finishes
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

    // With the ring open (over a button or link) there is no trail: only the circle remains
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
