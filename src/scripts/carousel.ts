/**
 * carousel.ts
 * Featured projects carousel: previous / next buttons, tabs, keyboard arrows, touch swipe and an autoplay
 * that advances when the progress bar of the active tab finishes its CSS animation.
 */

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

  /** Scrolls to the given slide (wrapping around at both ends) and marks its tab as active. */
  function goTo(index: number): void {
    if (!track) return;

    const total = slides.length;
    current = (index + total) % total;

    // While a programmatic scroll is running the observer is ignored (with a timeout in case "scrollend" never fires)
    autoScrolling = true;
    clearTimeout(autoScrollTimer);
    autoScrollTimer = window.setTimeout(() => (autoScrolling = false), 900);
    track.scrollTo({ left: slides[current].offsetLeft - track.offsetLeft, behavior: "smooth" });
    updateDots(current);
  }

  /** Marks the tab of the given slide as the current one. */
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

  // Autoplay: when the progress bar of the active tab fills up, move to the next slide
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

  // Keep the tabs in sync when the user swipes with a finger or a trackpad
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
