/**
 * themeToggle.ts
 * Light / dark theme switcher. The theme is stored in localStorage and defaults to the system preference;
 * the `dark` class on <html> is what the stylesheet reacts to.
 */

const toggleButton = document.getElementById("theme-toggle") as HTMLButtonElement | null;

type Theme = "dark" | "light";

/** Applies the theme to the page and remembers it. */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const isDark = theme === "dark";

  root.classList.toggle("dark", isDark);

  localStorage.setItem("theme", theme);
}

/** Returns the saved theme, or the system preference when nothing was saved. */
function getInitialTheme(): Theme {
  const saved = localStorage.getItem("theme") as Theme | null;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return saved ?? (systemDark ? "dark" : "light");
}

applyTheme(getInitialTheme());

toggleButton?.addEventListener("click", () => {
  const isDark = document.documentElement.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
});
