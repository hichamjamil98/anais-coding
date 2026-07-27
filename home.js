/* ==========================================================================
   HOME PAGE — COMPLETE INTERACTIONS
   CTA + SKILL CARDS
========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") {
    console.warn("GSAP is missing.");
    return;
  }

  initHomeSubheroCTA();
  initSkillCards();
});

/* ==========================================================================
   1. HOME SUBHERO CTA
   - Ne modifie jamais .home--subhero-cta_inside
   - Zoom léger de l'image
   - Petite augmentation de la largeur de .arrow--60
========================================================================== */

function initHomeSubheroCTA() {
  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  document.querySelectorAll(".home--subhero-cta").forEach((wrapper) => {
    const trigger = wrapper.querySelector(".home--subhero-cta_inside");
    const image = wrapper.querySelector(":scope > .image--absolute100");
    const arrow = trigger?.querySelector(".arrow--60");

    if (!trigger) return;
    if (trigger.dataset.homeHoverReady === "true") return;

    trigger.dataset.homeHoverReady = "true";

    /*
     * Nettoyage des anciennes versions ayant injecté width: 296px
     * ou des transformations sur le SVG.
     */
    if (arrow) {
      gsap.set(arrow, {
        clearProps:
          "width,maxWidth,minWidth,transform,transformOrigin,translate,scale,rotate"
      });

      gsap.set(arrow, {
        width: "3.75rem",
        maxWidth: "3.75rem",
        minWidth: "3.75rem"
      });
    }

    if (image) {
      gsap.set(image, {
        clearProps: "transform,translate,scale,rotate"
      });

      gsap.set(image, {
        scale: 1
      });
    }

    const timeline = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.7,
        ease: "power3.out"
      }
    });

    if (image) {
      timeline.to(
        image,
        {
          scale: 1.045
        },
        0
      );
    }

    if (arrow) {
      timeline.to(
        arrow,
        {
          width: "4.25rem",
          maxWidth: "4.25rem",
          minWidth: "4.25rem"
        },
        0
      );
    }

    const open = () => timeline.play();
    const close = () => timeline.reverse();

    if (canHover) {
      trigger.addEventListener("mouseenter", open);
      trigger.addEventListener("mouseleave", close);
    }

    trigger.addEventListener("focusin", open);
    trigger.addEventListener("focusout", close);
  });
}

/* ==========================================================================
   2. SKILL CARDS
   - Flèche cachée au départ
   - Apparition fluide au hover
   - Léger déplacement du H3 vers la droite
   - Zoom discret de l'image
========================================================================== */

function initSkillCards() {
  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  document.querySelectorAll(".skill--card").forEach((card) => {
    const arrow = card.querySelector(".btn--arrow-wrapper.is--card");
    const title = card.querySelector(".heading-style-64.is--skill");
    const image = card.querySelector(
      ".skill--image-wrapper > .image--absolute100"
    );

    if (card.dataset.skillHoverReady === "true") return;

    card.dataset.skillHoverReady = "true";

    if (!canHover) {
      if (arrow) {
        gsap.set(arrow, {
          opacity: 1,
          visibility: "visible",
          y: 0
        });
      }

      return;
    }

    if (arrow) {
      gsap.set(arrow, {
        opacity: 0,
        visibility: "hidden",
        y: "-0.5rem"
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
        duration: 0.6,
        ease: "power3.out"
      }
    });

    if (arrow) {
      timeline.to(
        arrow,
        {
          opacity: 1,
          visibility: "visible",
          y: 0
        },
        0
      );
    }

    if (title) {
      timeline.to(
        title,
        {
          x: "0.35rem"
        },
        0
      );
    }

    if (image) {
      timeline.to(
        image,
        {
          scale: 1.035
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