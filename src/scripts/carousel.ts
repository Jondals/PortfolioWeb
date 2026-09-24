const carousels = document.querySelectorAll<HTMLElement>(".carousel");

carousels.forEach((carousel) => {
  const track = carousel.querySelector<HTMLElement>(".carousel-track");
  const slides = carousel.querySelectorAll<HTMLElement>(".carousel-slide");
  const dots = carousel.querySelectorAll<HTMLButtonElement>(".carousel-dot");
  const prevBtn = carousel.querySelector<HTMLButtonElement>(".carousel-prev");
  const nextBtn = carousel.querySelector<HTMLButtonElement>(".carousel-next");

  if (!track || slides.length === 0) return;

  let current = 0;

  function goTo(index: number): void {
    if (!track) return;

    const total = slides.length;
    current = (index + total) % total;
    track.scrollTo({ left: slides[current].offsetLeft - track.offsetLeft, behavior: "smooth" });
  }

  function updateDots(index: number): void {
    dots.forEach((dot, i) => {
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });
  }

  prevBtn?.addEventListener("click", () => goTo(current - 1));
  nextBtn?.addEventListener("click", () => goTo(current + 1));

  dots.forEach((dot) => {
    dot.addEventListener("click", () => goTo(Number(dot.dataset.index)));
  });

  track.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(current - 1);
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(current + 1);
    }
  });

  // Sincroniza los puntos cuando se desliza con el dedo o el trackpad
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        current = Array.from(slides).indexOf(entry.target as HTMLElement);
        updateDots(current);
      });
    },
    { root: track, threshold: 0.6 }
  );

  slides.forEach((slide) => observer.observe(slide));
});
