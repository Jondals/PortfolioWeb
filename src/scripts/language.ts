const STORAGE_KEY = "language";

const toggles = document.querySelectorAll<HTMLButtonElement>(".lang-toggle");

let currentLang = getInitialLanguage();

function getInitialLanguage(): string {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;

  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith("es") ? "es" : "en";
}

function applyLanguage(lang: string): void {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.setAttribute("data-lang", lang);

  document.querySelectorAll<HTMLElement>("[data-en]").forEach((el) => {
    const text =
      lang === "es"
        ? el.getAttribute("data-es")
        : el.getAttribute("data-en");

    if (text !== null) {
      el.textContent = text;
    }
  });

  toggles.forEach((toggle) => {
    toggle.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a español");
  });
}

function setLanguage(lang: string): void {
  localStorage.setItem(STORAGE_KEY, lang);
  applyLanguage(lang);
}

applyLanguage(currentLang);

toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    setLanguage(currentLang === "es" ? "en" : "es");
  });
});
