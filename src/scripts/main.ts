// Lo visible al cargar se ejecuta ya; el resto se carga cuando el navegador está libre,
// cada módulo en su propia tarea corta para no bloquear el hilo principal
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

function loadNext(): void {
  const next = deferred.shift();
  if (!next) {
    document.documentElement.dataset.ready = "true";
    return;
  }

  next().finally(() => idle(loadNext));
}

idle(loadNext);
