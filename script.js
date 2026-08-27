const projectDialog = document.querySelector(".project-dialog");
const dialogTitle = document.querySelector("#project-dialog-title");
const dialogDescription = document.querySelector("#project-dialog-description");
const dialogClose = document.querySelector(".dialog-close");
const hero = document.querySelector(".intro");
const contentStack = document.querySelector(".content-stack");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let heroUpdateQueued = false;
let lastScrollY = window.scrollY;
let scrollDrag = 0;
let dragFrame = 0;

const updateHeroProgress = () => {
  heroUpdateQueued = false;

  const fadeDistance = hero.offsetHeight * 0.78;
  const progress = Math.min(1, Math.max(0, window.scrollY / fadeDistance));
  document.documentElement.style.setProperty("--hero-progress", progress.toFixed(3));
};

const requestHeroUpdate = () => {
  if (heroUpdateQueued) return;
  heroUpdateQueued = true;
  window.requestAnimationFrame(updateHeroProgress);
};

const renderScrollDrag = () => {
  scrollDrag *= 0.9;

  if (Math.abs(scrollDrag) < 0.05) {
    scrollDrag = 0;
    dragFrame = 0;
  } else {
    dragFrame = window.requestAnimationFrame(renderScrollDrag);
  }

  document.documentElement.style.setProperty("--scroll-drag", `${scrollDrag.toFixed(2)}px`);
};

const updateScrollDrag = () => {
  const currentScrollY = window.scrollY;
  const delta = currentScrollY - lastScrollY;
  lastScrollY = currentScrollY;

  if (!contentStack) {
    scrollDrag = 0;
    document.documentElement.style.setProperty("--scroll-drag", "0px");
    return;
  }

  const dragLimit = reduceMotion.matches ? 32 : 56;
  const dragStrength = reduceMotion.matches ? 0.16 : 0.24;
  scrollDrag = Math.max(-dragLimit, Math.min(dragLimit, scrollDrag + delta * dragStrength));

  if (!dragFrame) {
    dragFrame = window.requestAnimationFrame(renderScrollDrag);
  }
};

window.addEventListener("scroll", requestHeroUpdate, { passive: true });
window.addEventListener("scroll", updateScrollDrag, { passive: true });
window.addEventListener("resize", requestHeroUpdate);
reduceMotion.addEventListener("change", requestHeroUpdate);
updateHeroProgress();

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", () => {
    dialogTitle.textContent = card.dataset.title;
    dialogDescription.textContent = card.dataset.description;
    projectDialog.showModal();
  });
});

dialogClose.addEventListener("click", () => projectDialog.close());

projectDialog.addEventListener("click", (event) => {
  if (event.target === projectDialog) projectDialog.close();
});
