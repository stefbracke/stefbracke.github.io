const projectDialog = document.querySelector(".project-dialog");
const dialogTitle = document.querySelector("#project-dialog-title");
const dialogDescription = document.querySelector("#project-dialog-description");
const dialogClose = document.querySelector(".dialog-close");
const hero = document.querySelector(".intro");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let heroUpdateQueued = false;

const updateHeroProgress = () => {
  heroUpdateQueued = false;

  if (reduceMotion.matches) {
    document.documentElement.style.setProperty("--hero-progress", 0);
    return;
  }

  const fadeDistance = hero.offsetHeight * 0.78;
  const progress = Math.min(1, Math.max(0, window.scrollY / fadeDistance));
  document.documentElement.style.setProperty("--hero-progress", progress.toFixed(3));
};

const requestHeroUpdate = () => {
  if (heroUpdateQueued) return;
  heroUpdateQueued = true;
  window.requestAnimationFrame(updateHeroProgress);
};

window.addEventListener("scroll", requestHeroUpdate, { passive: true });
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
