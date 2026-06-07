const select = document.querySelector("select") as HTMLSelectElement | null;
const browserLang = navigator.language.toLowerCase();
const detectedLang = browserLang.startsWith("es") ? "es" : "en";
const savedLang = localStorage.getItem("language");
const currentLang = savedLang || detectedLang;

document.documentElement.lang = currentLang;

if (select) {
  select.value = currentLang;

  select.addEventListener("change", (e) => {
    const lang = (e.target as HTMLSelectElement).value;

    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;

    applyLanguage(lang);
  });
}

function applyLanguage(lang: string) {
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
}

applyLanguage(currentLang);