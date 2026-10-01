/**
 * main.ts
 * Entry point loaded by the layout. What is visible immediately (language, theme, entrance
 * animations) runs right away; everything else loads one module at a time while the browser is
 * idle, so no single long task blocks the main thread during page load.
 */
import "./language";
import "./themeToggle";
import "./reveal";

const deferred = [
  () => import("./nav"),
  () => import("./carousel"),
  () => import("./collapse"),
  () => import("./background"),
  () => import("./trail"),
  () => import("./sound"),
  () => import("./contextmenu"),
];

const idle = (callback: () => void) =>
  "requestIdleCallback" in window ? window.requestIdleCallback(callback, { timeout: 1500 }) : setTimeout(callback, 1);

/** Loads the next deferred module, then waits for another idle slot before loading the following one. */
function loadNext(): void {
  const next = deferred.shift();
  if (!next) {
    document.documentElement.dataset.ready = "true";
    return;
  }

  next().finally(() => idle(loadNext));
}

idle(loadNext);
