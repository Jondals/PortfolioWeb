const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-menu");

function openMenu() {
  if (!(mobileMenu instanceof HTMLElement) || !(overlay instanceof HTMLElement)) return;

  mobileMenu.classList.remove("translate-x-full");
  mobileMenu.inert = false;
  overlay.classList.remove("opacity-0", "pointer-events-none");
  menuBtn?.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  closeBtn?.focus();
}

function closeMenu() {
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

// Resalta en el menú la sección visible
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
