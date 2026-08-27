const hero = document.querySelector(".intro");

let heroUpdateQueued = false;

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

window.addEventListener("scroll", requestHeroUpdate, { passive: true });
window.addEventListener("resize", requestHeroUpdate);
updateHeroProgress();

const projectCards = document.querySelectorAll(".project-card");
const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

projectCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (!precisePointer.matches || reducedMotion.matches) return;

    const bounds = card.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    card.style.setProperty("--tilt-x", `${(-vertical * 5).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${(horizontal * 6).toFixed(2)}deg`);
    card.style.setProperty("--pan-x", `${(-horizontal * 8).toFixed(2)}px`);
    card.style.setProperty("--pan-y", `${(-vertical * 6).toFixed(2)}px`);
  }, { passive: true });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--pan-x", "0px");
    card.style.setProperty("--pan-y", "0px");
  });
});
