/**
 * nav.ts
 * Navigation behaviour:
 *  - opens and closes the mobile menu (button, overlay, Escape key and link clicks),
 *  - highlights the menu link of the section that is currently on screen,
 *  - toggles the header background when the page is scrolled.
 */

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-menu");

/** Slides the mobile menu in, shows the overlay and locks the page scroll. */
function openMenu(): void {
  if (!(mobileMenu instanceof HTMLElement) || !(overlay instanceof HTMLElement)) return;

  mobileMenu.classList.remove("translate-x-full");
  mobileMenu.inert = false;
  overlay.classList.remove("opacity-0", "pointer-events-none");
  menuBtn?.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  closeBtn?.focus();
}

/** Slides the mobile menu out, hides the overlay and unlocks the page scroll. */
function closeMenu(): void {
  if (!(mobileMenu instanceof HTMLElement) || !(overlay instanceof HTMLElement)) return;

  mobileMenu.classList.add("translate-x-full");
  mobileMenu.inert = true;
  overlay.classList.add("opacity-0", "pointer-events-none");
  menuBtn?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

menuBtn?.addEventListener("click", openMenu);
closeBtn?.addEventListener("click", closeMenu);
overlay?.addEventListener("click", closeMenu);

document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape") closeMenu();
});

document.querySelectorAll("#mobile-menu a").forEach((a) => {
  a.addEventListener("click", closeMenu);
});

// Highlight the menu link of the section in the middle of the screen
const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
const sections = document.querySelectorAll<HTMLElement>("main section[id], footer[id]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.setAttribute("aria-current", active ? "true" : "false");
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => observer.observe(section));

// Header: transparent at the top of the page, blurred background once the user scrolls
const header = document.querySelector<HTMLElement>(".site-header");

/** Adds or removes the `is-scrolled` class depending on the scroll position. */
function updateHeader(): void {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
