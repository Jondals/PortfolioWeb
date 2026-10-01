/**
 * contextmenu.ts
 * Disables the browser's right-click context menu across the whole page.
 */
document.addEventListener("contextmenu", (e: MouseEvent) => e.preventDefault());
