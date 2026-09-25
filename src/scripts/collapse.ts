// Despliega y contrae con suavidad los bloques .more-projects
document.querySelectorAll<HTMLElement>(".more-projects").forEach((block) => {
  const toggle = block.querySelector<HTMLButtonElement>(".collapse-toggle");
  const panel = block.querySelector<HTMLElement>(".collapse-panel");
  const label = block.querySelector<HTMLElement>(".collapse-label");
  const icon = block.querySelector<SVGElement>(".collapse-icon");

  if (!toggle || !panel || !label) return;

  const texts = {
    closed: { en: label.dataset.en ?? "", es: label.dataset.es ?? "" },
    open: { en: "Hide", es: "Ocultar" },
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    const lang = document.documentElement.lang === "es" ? "es" : "en";
    const text = open ? texts.open : texts.closed;

    toggle.setAttribute("aria-expanded", String(open));
    panel.inert = !open;
    panel.classList.toggle("grid-rows-[0fr]", !open);
    panel.classList.toggle("grid-rows-[1fr]", open);
    panel.classList.toggle("opacity-0", !open);
    icon?.classList.toggle("rotate-180", open);

    // El idioma se aplica con data-en/data-es, así que se actualizan también
    label.dataset.en = text.en;
    label.dataset.es = text.es;
    label.textContent = text[lang];

  });
});
