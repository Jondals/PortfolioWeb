const toggleButton = document.getElementById("theme-toggle") as HTMLButtonElement | null;

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const isDark = theme === "dark";

  root.classList.toggle("dark", isDark);

  localStorage.setItem("theme", theme);
}

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
