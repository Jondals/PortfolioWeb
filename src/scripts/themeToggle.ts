const toggleButton = document.getElementById("theme-toggle") as HTMLButtonElement | null;
const icon = document.getElementById("theme-icon") as HTMLImageElement | null;

const darkIcon = "/icons/moon.svg";
const lightIcon = "/icons/sun.svg";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const isDark = theme === "dark";

  root.classList.toggle("dark", isDark);

  localStorage.setItem("theme", theme);

  if (icon) {
    icon.src = isDark ? darkIcon : lightIcon;
  }
}

function getInitialTheme(): Theme {
  const saved = localStorage.getItem("theme") as Theme | null;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return saved ?? (systemDark ? "dark" : "light");
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(getInitialTheme());

  toggleButton?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    applyTheme(isDark ? "light" : "dark");
  });
});