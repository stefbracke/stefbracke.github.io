const projectDialog = document.querySelector(".project-dialog");
const dialogTitle = document.querySelector("#project-dialog-title");
const dialogDescription = document.querySelector("#project-dialog-description");
const dialogClose = document.querySelector(".dialog-close");

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
