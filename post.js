/* ==========================================================================
   POSTS HOVER
========================================================================== */

window.addEventListener("load", () => {

    document.querySelectorAll(".post--item").forEach((post) => {
  
      const image = post.querySelector(".post--image-wrapper img");
      const button = post.querySelector(".btn");
  
      post.addEventListener("mouseenter", () => {
        if (image) image.style.transform = "scale(1.08)";
        if (button) button.style.transform = "translateY(-0.35rem)";
      });
  
      post.addEventListener("mouseleave", () => {
        if (image) image.style.transform = "scale(1)";
        if (button) button.style.transform = "translateY(0)";
      });
  
    });
  
  });