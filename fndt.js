/* ==========================================================================
   FONDEMENTS — TAB CARD HOVERS
   fnd.js
========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined") {
      console.warn("GSAP is missing.");
      return;
    }
  
    initFondementTabHovers();
  });
  
  /* ==========================================================================
     FONDEMENT TAB HOVERS
  ========================================================================== */
  
  function initFondementTabHovers() {
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
  
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  
    document.querySelectorAll(".fndmt--tab-link").forEach((link) => {
      if (link.dataset.fndHoverReady === "true") return;
  
      const image = link.querySelector(
        ".fndmt--tab-image > .image--absolute100"
      );
  
      const arrow = link.querySelector(".tab--arrow");
      const heading = link.querySelector(".fndmt--tab-heading");
  
      /*
       * Select only the heading--rod-parent that belongs directly
       * to the clickable tab card, not the ones inside tab content.
       */
      const rodContent = link.querySelector(
        ":scope > .heading--rod-parent"
      );
  
      link.dataset.fndHoverReady = "true";
  
      /*
       * Touch devices do not have a reliable hover state.
       * Keep the secondary elements visible.
       */
      if (!canHover) {
        if (arrow) {
          gsap.set(arrow, {
            opacity: 1,
            visibility: "visible",
            y: 0
          });
        }
  
        if (rodContent) {
          gsap.set(rodContent, {
            opacity: 1,
            visibility: "visible",
            y: 0
          });
        }
  
        return;
      }
  
      /* Initial states */
  
      if (image) {
        gsap.set(image, {
          scale: 1,
          transformOrigin: "center center"
        });
      }
  
      if (heading) {
        gsap.set(heading, {
          y: 0
        });
      }
  
      if (arrow) {
        gsap.set(arrow, {
          opacity: 0,
          visibility: "hidden",
          y: "-0.5rem"
        });
      }
  
      if (rodContent) {
        gsap.set(rodContent, {
          opacity: 0,
          visibility: "hidden",
          y: "0.5rem"
        });
      }
  
      if (reduceMotion) {
        const show = () => {
          if (arrow) {
            gsap.set(arrow, {
              opacity: 1,
              visibility: "visible",
              y: 0
            });
          }
  
          if (rodContent) {
            gsap.set(rodContent, {
              opacity: 1,
              visibility: "visible",
              y: 0
            });
          }
        };
  
        const hide = () => {
          if (arrow) {
            gsap.set(arrow, {
              opacity: 0,
              visibility: "hidden",
              y: 0
            });
          }
  
          if (rodContent) {
            gsap.set(rodContent, {
              opacity: 0,
              visibility: "hidden",
              y: 0
            });
          }
        };
  
        link.addEventListener("mouseenter", show);
        link.addEventListener("mouseleave", hide);
        link.addEventListener("focusin", show);
        link.addEventListener("focusout", hide);
  
        return;
      }
  
      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          duration: 0.65,
          ease: "power3.out"
        }
      });
  
      /* Slight image zoom */
      if (image) {
        timeline.to(
          image,
          {
            scale: 1.045
          },
          0
        );
      }
  
      /* Move heading a few pixels upward */
      if (heading) {
        timeline.to(
          heading,
          {
            y: "-0.4rem"
          },
          0
        );
      }
  
      /* Arrow appears smoothly */
      if (arrow) {
        timeline.to(
          arrow,
          {
            opacity: 1,
            visibility: "visible",
            y: 0,
            duration: 0.55
          },
          0.05
        );
      }
  
      /* Rod content appears smoothly */
      if (rodContent) {
        timeline.to(
          rodContent,
          {
            opacity: 1,
            visibility: "visible",
            y: 0,
            duration: 0.6
          },
          0.08
        );
      }
  
      const open = () => timeline.play();
      const close = () => timeline.reverse();
  
      link.addEventListener("mouseenter", open);
      link.addEventListener("mouseleave", close);
      link.addEventListener("focusin", open);
      link.addEventListener("focusout", close);
    });
  }

  /* ==========================================================================
     FONDEMENT TAB scroll
  ========================================================================== */
  
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".w-tab-link").forEach((tab) => {
      tab.addEventListener("click", () => {
        setTimeout(() => {
          const activePane = document.querySelector(
            ".w-tab-pane.w--tab-active"
          );
  
          if (!activePane) return;
  
          const remInPixels = parseFloat(
            getComputedStyle(document.documentElement).fontSize
          );
  
          const offset = 10 * remInPixels;
  
          const startPosition = window.scrollY;
  
          const targetPosition =
            activePane.getBoundingClientRect().top +
            window.scrollY -
            offset;
  
          const distance = targetPosition - startPosition;
          const duration = 1200;
          let startTime = null;
  
          const easeInOutCubic = (progress) => {
            return progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          };
  
          const animateScroll = (currentTime) => {
            if (!startTime) startTime = currentTime;
  
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easing = easeInOutCubic(progress);
  
            window.scrollTo(
              0,
              startPosition + distance * easing
            );
  
            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            }
          };
  
          requestAnimationFrame(animateScroll);
        }, 100);
      });
    });
  });