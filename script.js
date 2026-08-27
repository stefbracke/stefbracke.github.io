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
