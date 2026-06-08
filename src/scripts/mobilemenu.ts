const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-menu");

function openMenu() {
  if (!(mobileMenu instanceof HTMLElement) || !(overlay instanceof HTMLElement)) return;

  mobileMenu.classList.remove("translate-x-full");
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  if (!(mobileMenu instanceof HTMLElement) || !(overlay instanceof HTMLElement)) return;

  mobileMenu.classList.add("translate-x-full");
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}

menuBtn?.addEventListener("click", openMenu);
closeBtn?.addEventListener("click", closeMenu);
overlay?.addEventListener("click", closeMenu);

document.querySelectorAll("#mobile-menu a").forEach((a) => {
  a.addEventListener("click", closeMenu);
});