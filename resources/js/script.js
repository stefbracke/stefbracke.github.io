$(document).ready(function () {
  /* For the sticky navigation */
//   $(".js--section-features").waypoint(
//     function (direction) {
//       if (direction == "down") {
//         $("nav").addClass("sticky");
//       } else {
//         $("nav").removeClass("sticky");
//       }
//     },
//     {
//       offset: "100px",
//     }
//   );

  /* Scroll on buttons */
  //   $(".js--scroll-to-plans").click(function () {
  //     $("html, body").animate(
  //       {
  //         scrollTop: $(".js--section-plans").offset().top,
  //       },
  //       1000
  //     );
  //   });
  //   $(".js--scroll-to-start").click(function () {
  //     $("html, body").animate(
  //       {
  //         scrollTop: $(".js--section-features").offset().top,
  //       },
  //       1000
  //     );
  //   });

  /* Navigation scroll */
  //   $(function () {
  //     $('a[href*="#"]:not([href="#"])').click(function () {
  //       if (
  //         location.pathname.replace(/^\//, "") ==
  //           this.pathname.replace(/^\//, "") &&
  //         location.hostname == this.hostname
  //       ) {
  //         var target = $(this.hash);
  //         target = target.length
  //           ? target
  //           : $("[name=" + this.hash.slice(1) + "]");
  //         if (target.length) {
  //           $("html, body").animate({ scrollTop: target.offset().top }, 1000);
  //           return false;
  //         }
  //       }
  //     });
  //   });

  /* Animations on scroll */
  // $('.js--wp-1').waypoint(function (direction) {
  //     $('.js--wp-1').addClass('animate__animated animate__fadeIn');
  // }, {
  //     offset: '50%'
  // });

  // $('.js--wp-2').waypoint(function (direction) {
  //     $('.js--wp-2').addClass('animate__animated animate__fadeInUp');
  // }, {
  //     offset: '50%'
  // });

  // $('.js--wp-3').waypoint(function (direction) {
  //     $('.js--wp-3').addClass('animate__animated animate__fadeIn');
  // }, {
  //     offset: '50%'
  // });

  // $('.js--wp-4').waypoint(function (direction) {
  //     $('.js--wp-4').addClass('animate__animated animate__pulse');
  // }, {
  //     offset: '50%'
  // });

  /* Mobile navigation */
//   $(".js--section-features").waypoint(
//     function (direction) {
//       if (direction == "down") {
//         $("nav").addClass("sticky");
//       } else {
//         $("nav").removeClass("sticky");
//       }
//     },
//     {
//       offset: "100px",
//     }
//   );

//   /* Toggle mobile nav icons */
//   $(".js--nav-icon").click(function () {
//     var nav = $(".js--main-nav");
//     var menuIcon = $(".js--nav-icon-menu");
//     var closeIcon = $(".js--nav-icon-close");

//     nav.slideToggle(200);

//     // Toggle visibility of icons
//     menuIcon.toggleClass("hidden");
//     closeIcon.toggleClass("hidden");
//   });
// });
});

const articleModal = document.querySelector("#article-modal");
const articleModalContent = document.querySelector("#article-modal-content");
const articleModalClose = document.querySelector(".article-modal-close");
const articleButtons = document.querySelectorAll("[data-article]");
let articleTrigger = null;

function openArticle(articleId, trigger) {
  const articleTemplate = document.querySelector(`#article-${articleId}`);

  if (!articleModal || !articleModalContent || !articleTemplate) return;

  articleTrigger = trigger;
  articleModalContent.replaceChildren(
    articleTemplate.content.cloneNode(true),
  );
  document.body.classList.add("modal-open");
  articleModal.showModal();
  articleModalContent.scrollTop = 0;
  articleModalClose.focus();
}

function closeArticle() {
  if (!articleModal?.open) return;
  articleModal.close();
}

articleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openArticle(button.dataset.article, button);
  });
});

articleModalClose?.addEventListener("click", closeArticle);

articleModal?.addEventListener("click", (event) => {
  if (event.target === articleModal) closeArticle();
});

articleModal?.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  articleModalContent.replaceChildren();
  articleTrigger?.focus();
});

const imageModal = document.querySelector("#image-modal");
const imageModalPreview = document.querySelector(".image-modal-preview");
const imageModalClose = document.querySelector(".image-modal-close");
const workImageButtons = document.querySelectorAll(".work-image-button");
let imageTrigger = null;

function openProjectImage(button) {
  const image = button.querySelector("img");

  if (!imageModal || !imageModalPreview || !image) return;

  imageTrigger = button;
  imageModalPreview.src = image.currentSrc || image.src;
  imageModalPreview.alt = image.alt;
  document.body.classList.add("modal-open");
  imageModal.showModal();
  imageModalClose.focus();
}

function closeProjectImage() {
  if (imageModal?.open) imageModal.close();
}

workImageButtons.forEach((button) => {
  button.addEventListener("click", () => openProjectImage(button));
});

imageModalClose?.addEventListener("click", closeProjectImage);

imageModal?.addEventListener("click", (event) => {
  if (event.target === imageModal) closeProjectImage();
});

imageModal?.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  imageModalPreview.removeAttribute("src");
  imageTrigger?.focus();
});
