/**
 * carousel.ts
 * Featured projects carousel: previous / next buttons, tabs, keyboard arrows, touch swipe and an autoplay
 * that advances when the progress bar of the active tab finishes its CSS animation.
 */

const SHOT_MS = 2800;

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
  // Per project: shows its next screenshot / goes back to its first one
  const shows: { next: () => void; reset: () => void }[] = [];

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
    // A project always starts again from its first screenshot
    shows[index]?.reset();
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
    { root: track, threshold: 0.6 },
  );

  slides.forEach((slide) => observer.observe(slide));

  // The screenshots of a project: dots, arrows, swipe and an automatic slideshow while the project is the active one
  slides.forEach((slide, slideIndex) => {
    const shots = slide.querySelectorAll<HTMLElement>("[data-shot]");
    const shotDots = slide.querySelectorAll<HTMLButtonElement>(".gallery-dot");
    const counter = slide.querySelector<HTMLElement>(".shot-counter");
    const caption = slide.querySelector<HTMLElement>(".shot-caption");
    const frame = slide.querySelector<HTMLElement>(".shots");
    let shown = 0;

    function show(index: number): void {
      shown = (index + shots.length) % shots.length;
      shots.forEach((shot, i) => shot.toggleAttribute("data-active", i === shown));
      shotDots.forEach((dot, i) => dot.setAttribute("aria-current", i === shown ? "true" : "false"));
      if (counter) counter.textContent = `${shown + 1} / ${shots.length}`;
      if (caption) {
        caption.dataset.en = shots[shown].dataset.captionEn ?? "";
        caption.dataset.es = shots[shown].dataset.captionEs ?? "";
        caption.textContent = document.documentElement.lang === "es" ? caption.dataset.es : caption.dataset.en;
      }
    }

    shows[slideIndex] = { next: () => show(shown + 1), reset: () => show(0) };
    if (shots.length < 2) return;

    shotDots.forEach((dot) => dot.addEventListener("click", () => show(Number(dot.dataset.shotIndex))));
    slide.querySelector(".shot-prev")?.addEventListener("click", () => show(shown - 1));
    slide.querySelector(".shot-next")?.addEventListener("click", () => show(shown + 1));

    // Swipe on the screenshot
    let startX = 0;
    frame?.addEventListener("pointerdown", (e: PointerEvent) => (startX = e.clientX));
    frame?.addEventListener("pointerup", (e: PointerEvent) => {
      const delta = e.clientX - startX;
      if (Math.abs(delta) > 40) show(shown + (delta < 0 ? 1 : -1));
    });
  });

  // One timer for the whole carousel: it advances the screenshots of the active project, and only while nobody is interacting
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.setInterval(() => {
      if (document.hidden || carousel.matches(":hover") || carousel.matches(":has(:focus-visible)")) return;
      shows[current]?.next();
    }, SHOT_MS);
  }
});
