const STORAGE_KEY = "language";

const selects = document.querySelectorAll<HTMLSelectElement>(
  "#language-select, #mobile-language-select"
);

function getInitialLanguage(): string {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;

  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith("es") ? "es" : "en";
}

function applyLanguage(lang: string): void {
  document.documentElement.lang = lang;

  document.querySelectorAll<HTMLElement>("[data-en]").forEach((el) => {
    const text =
      lang === "es"
        ? el.getAttribute("data-es")
        : el.getAttribute("data-en");

    if (text !== null) {
      el.textContent = text;
    }
  });

  selects.forEach((s) => {
    s.value = lang;
  });
}

function setLanguage(lang: string): void {
  localStorage.setItem(STORAGE_KEY, lang);
  applyLanguage(lang);
}

const currentLang = getInitialLanguage();
applyLanguage(currentLang);

selects.forEach((select) => {
  select.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLSelectElement | null;
    if (!target) return;

    setLanguage(target.value);
  });
});