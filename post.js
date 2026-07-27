/* ==========================================================================
   POST CARD HOVER
========================================================================== */

window.addEventListener("load", () => {
    const posts = document.querySelectorAll(".post--item");
  
    posts.forEach((post) => {
      const image = post.querySelector(".post--image-wrapper > img");
  
      /*
       * On cible le lien direct dans .post--text.
       * Cela évite de modifier .btn, qui possède déjà ses propres animations.
       */
      const postLink = post.querySelector(".post--text > a.inline-block");
  
      if (!image && !postLink) return;
  
      if (image) {
        gsap.set(image, {
          scale: 1,
          transformOrigin: "center center"
        });
      }
  
      if (postLink) {
        gsap.set(postLink, {
          y: 0
        });
      }
  
      post.addEventListener("mouseenter", () => {
        if (image) {
          gsap.to(image, {
            scale: 1.08,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
  
        if (postLink) {
          gsap.to(postLink, {
            y: -6,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
      });
  
      post.addEventListener("mouseleave", () => {
        if (image) {
          gsap.to(image, {
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
  
        if (postLink) {
          gsap.to(postLink, {
            y: 0,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
      });
    });
  });