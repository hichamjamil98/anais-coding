/* ==========================================================================
   HOME PAGE — CTA + SKILL CARDS
   Dependencies: GSAP 3+
========================================================================== */

(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined") {
      console.warn("GSAP is missing. home.js was not initialized.");
      return;
    }

    initHomeSubheroCTA();
    initSkillCards();
  });

  /* ==========================================================================
     1. HOME SUBHERO CTA
  ========================================================================== */

  function initHomeSubheroCTA() {
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!canHover) return;

    document.querySelectorAll(".home--subhero-cta").forEach((wrapper) => {
      const trigger = wrapper.querySelector(".home--subhero-cta_inside");
      const image = wrapper.querySelector(":scope > .image--absolute100");
      const arrow = trigger?.querySelector(".arrow--60");

      if (!trigger || (!image && !arrow)) return;
      if (trigger.dataset.homeHoverReady === "true") return;

      trigger.dataset.homeHoverReady = "true";

      let baseArrowWidth = 0;

      if (arrow) {
        gsap.set(arrow, {
          clearProps: "transform,width"
        });

        baseArrowWidth = arrow.getBoundingClientRect().width;

        gsap.set(arrow, {
          width: baseArrowWidth,
          transformOrigin: "left center"
        });
      }

      if (image) {
        gsap.set(image, {
          clearProps: "transform",
          scale: 1
        });
      }

      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          duration: 0.8,
          ease: "power4.out"
        }
      });

      if (image) {
        timeline.to(
          image,
          {
            scale: 1.055,
            duration: 1
          },
          0
        );
      }

      if (arrow) {
        timeline.to(
          arrow,
          {
            width: baseArrowWidth + 14,
            duration: 0.75
          },
          0
        );
      }

      const open = () => timeline.play();
      const close = () => timeline.reverse();

      trigger.addEventListener("mouseenter", open);
      trigger.addEventListener("mouseleave", close);
      trigger.addEventListener("focusin", open);
      trigger.addEventListener("focusout", close);

      let resizeTimer;

      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);

        resizeTimer = window.setTimeout(() => {
          if (!arrow) return;

          timeline.pause(0);
          gsap.set(arrow, { clearProps: "width,transform" });
          baseArrowWidth = arrow.getBoundingClientRect().width;
          gsap.set(arrow, {
            width: baseArrowWidth,
            transformOrigin: "left center"
          });

          timeline.invalidate();
        }, 160);
      });
    });
  }

  /* ==========================================================================
     2. SKILL CARDS
  ========================================================================== */

  function initSkillCards() {
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!canHover) return;

    document.querySelectorAll(".skill--card").forEach((card) => {
      const arrow = card.querySelector(".btn--arrow-wrapper.is--card");
      const title =
        card.querySelector(".heading-style-64.is--skill") ||
        card.querySelector("h3");
      const image = card.querySelector(
        ".skill--image-wrapper > .image--absolute100"
      );

      if (!arrow && !title && !image) return;
      if (card.dataset.skillHoverReady === "true") return;

      card.dataset.skillHoverReady = "true";

      if (arrow) {
        gsap.set(arrow, {
          autoAlpha: 0,
          y: -8,
          x: -4,
          scale: 0.94,
          pointerEvents: "none"
        });
      }

      if (title) {
        gsap.set(title, {
          x: 0
        });
      }

      if (image) {
        gsap.set(image, {
          scale: 1
        });
      }

      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          duration: 0.65,
          ease: "power4.out"
        }
      });

      if (arrow) {
        timeline.to(
          arrow,
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 0.6
          },
          0
        );
      }

      if (title) {
        timeline.to(
          title,
          {
            x: 8,
            duration: 0.65
          },
          0
        );
      }

      if (image) {
        timeline.to(
          image,
          {
            scale: 1.025,
            duration: 0.9
          },
          0
        );
      }

      const open = () => timeline.play();
      const close = () => timeline.reverse();

      card.addEventListener("mouseenter", open);
      card.addEventListener("mouseleave", close);
      card.addEventListener("focusin", open);
      card.addEventListener("focusout", close);
    });
  }
})();