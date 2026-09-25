const carousels = document.querySelectorAll<HTMLElement>(".carousel");

carousels.forEach((carousel) => {
  const track = carousel.querySelector<HTMLElement>(".carousel-track");
  const slides = carousel.querySelectorAll<HTMLElement>(".carousel-slide");
  const dots = carousel.querySelectorAll<HTMLButtonElement>(".carousel-dot");
  const prevBtns = carousel.querySelectorAll<HTMLButtonElement>(".carousel-prev");
  const nextBtns = carousel.querySelectorAll<HTMLButtonElement>(".carousel-next");

  if (!track || slides.length === 0) return;

  let current = 0;
  let autoScrolling = false;
  let autoScrollTimer = 0;

  function goTo(index: number): void {
    if (!track) return;

    const total = slides.length;
    current = (index + total) % total;

    // Mientras dura el desplazamiento programado se ignora el observer (con un tope por si no llega "scrollend")
    autoScrolling = true;
    clearTimeout(autoScrollTimer);
    autoScrollTimer = window.setTimeout(() => (autoScrolling = false), 900);
    track.scrollTo({ left: slides[current].offsetLeft - track.offsetLeft, behavior: "smooth" });
    updateDots(current);
  }

  function updateDots(index: number): void {
    dots.forEach((dot, i) => {
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });
  }

  prevBtns.forEach((btn) => btn.addEventListener("click", () => goTo(current - 1)));
  nextBtns.forEach((btn) => btn.addEventListener("click", () => goTo(current + 1)));

  dots.forEach((dot) => {
    dot.addEventListener("click", () => goTo(Number(dot.dataset.index)));
  });

  // Autoplay: cuando la barra de progreso de la pestaña activa se llena, pasa al siguiente
  carousel.addEventListener("animationend", (e: AnimationEvent) => {
    if ((e.target as Element).classList.contains("carousel-progress")) goTo(current + 1);
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

  track.addEventListener("scrollend", () => {
    clearTimeout(autoScrollTimer);
    autoScrolling = false;
  });

  // Sincroniza las pestañas cuando se desliza con el dedo o el trackpad
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || autoScrolling) return;

        const index = Array.from(slides).indexOf(entry.target as HTMLElement);
        if (index === current) return;

        current = index;
        updateDots(current);
      });
    },
    { root: track, threshold: 0.6 }
  );

  slides.forEach((slide) => observer.observe(slide));
});
