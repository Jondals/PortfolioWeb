/**
 * language.ts
 * Language switcher (English / Spanish).
 * Every translatable element carries `data-en` and `data-es` attributes; switching the language copies the
 * matching attribute into the element text. The choice is saved in localStorage and defaults to the browser language.
 */

const STORAGE_KEY = "language";

const toggles = document.querySelectorAll<HTMLButtonElement>(".lang-toggle");

let currentLang = getInitialLanguage();

/** Returns the saved language, or the browser language ("es" or "en") when nothing was saved. */
function getInitialLanguage(): string {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;

  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith("es") ? "es" : "en";
}

/** Writes the text of the given language into every translatable element and updates the toggle buttons. */
function applyLanguage(lang: string): void {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.setAttribute("data-lang", lang);

  document.querySelectorAll<HTMLElement>("[data-en]").forEach((el) => {
    const text = lang === "es" ? el.getAttribute("data-es") : el.getAttribute("data-en");

    // Only rewrite when the text changes: avoids recalculating the whole page on load
    if (text !== null && el.textContent?.trim() !== text) {
      el.textContent = text;
    }
  });

  toggles.forEach((toggle) => {
    toggle.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a español");
  });
}

/** Saves the language choice and applies it. */
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
