// Animación de entrada: los elementos con data-reveal aparecen al entrar en pantalla
const items = document.querySelectorAll<HTMLElement>("[data-reveal]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);

items.forEach((item) => observer.observe(item));
