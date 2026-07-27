/* ========================================================================== 
   ANAIS FREY — GLOBAL ANIMATIONS JS

   Dépendances :
   - GSAP
   - ScrollTrigger
   - SplitType, recommandé pour load-split et fade-split
========================================================================== */

window.addEventListener("DOMContentLoaded", () => {
    document.documentElement.classList.add("is-gsap-ready");
  
    if (typeof gsap === "undefined") {
      console.warn("GSAP n'est pas chargé.");
      revealEverything();
      return;
    }
  
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  
    initNavbar(reduceMotion);
    initButtons(reduceMotion);
    initSplitElements();
    initLoadAnimations(reduceMotion);
    initScrollAnimations(reduceMotion);
  
    window.addEventListener("load", () => {
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    });
  });
  
  /* ========================================================================== 
     HELPERS
  ========================================================================== */
  
  function revealEverything() {
    document.querySelectorAll("[animation]").forEach((element) => {
      element.style.opacity = "1";
      element.style.visibility = "visible";
      element.style.transform = "none";
    });
  }
  
  function getDirectChildren(parent) {
    return Array.from(parent.children).filter((child) => {
      return !child.classList.contains("w-condition-invisible");
    });
  }
  
  /* ========================================================================== 
     1. NAVBAR OPEN / CLOSE — DESKTOP + TABLETTE + MOBILE
  ========================================================================== */
  
  function initNavbar(reduceMotion) {
    const trigger = document.querySelector(".menu--trigger");
    const menu = document.querySelector(".nav--open");
  
    if (!trigger || !menu) return;
  
    const navbar = document.querySelector(".navbar");
    const panel = menu.querySelector(".container--nav-open") || menu;
    const menuLinks = gsap.utils.toArray(".nav--menu > .inline-block");
    const rightItems = gsap.utils.toArray(
      ".nav--open-right .nav--open-top, " +
      ".nav--open-right .parent--socials, " +
      ".is--navopen-bottom"
    );
    const openIcon = trigger.querySelector(".icon--open");
    const closeIcon = trigger.querySelector(".icon--close");
  
    let isOpen = false;
    let timeline = null;
  
    trigger.setAttribute("role", "button");
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-label", "Ouvrir le menu");
    menu.setAttribute("aria-hidden", "true");
  
    gsap.set(menu, {
      display: "none",
      autoAlpha: 0,
      pointerEvents: "none"
    });
  
    gsap.set(panel, {
      yPercent: -4,
      scale: 1.01
    });
  
    gsap.set(menuLinks, {
      y: "1.5rem",
      autoAlpha: 0,
      filter: "blur(6px)"
    });
  
    gsap.set(rightItems, {
      y: "1.25rem",
      autoAlpha: 0,
      filter: "blur(6px)"
    });
  
    if (openIcon) {
      gsap.set(openIcon, {
        autoAlpha: 1,
        rotate: 0,
        scale: 1
      });
    }
  
    if (closeIcon) {
      gsap.set(closeIcon, {
        autoAlpha: 0,
        rotate: -90,
        scale: 0.72
      });
    }
  
    function updateAccessibility(open) {
      trigger.setAttribute("aria-expanded", String(open));
      trigger.setAttribute(
        "aria-label",
        open ? "Fermer le menu" : "Ouvrir le menu"
      );
      menu.setAttribute("aria-hidden", String(!open));
    }
  
    function lockPage() {
      document.documentElement.classList.add("is-menu-open");
      document.body.classList.add("is-menu-open");
    }
  
    function unlockPage() {
      document.documentElement.classList.remove("is-menu-open");
      document.body.classList.remove("is-menu-open");
    }
  
    function openMenu() {
      if (isOpen) return;
      isOpen = true;
  
      if (timeline) timeline.kill();
  
      menu.classList.add("is-open");
      navbar?.classList.add("is-menu-open");
      updateAccessibility(true);
      lockPage();
  
      if (reduceMotion) {
        gsap.set(menu, {
          display: "block",
          autoAlpha: 1,
          pointerEvents: "auto"
        });
        gsap.set([panel, menuLinks, rightItems], {
          clearProps: "transform,opacity,visibility,filter"
        });
        if (openIcon) gsap.set(openIcon, { autoAlpha: 0 });
        if (closeIcon) gsap.set(closeIcon, { autoAlpha: 1 });
        return;
      }
  
      timeline = gsap.timeline({
        defaults: {
          overwrite: "auto"
        }
      });
  
      timeline
        .set(menu, {
          display: "block",
          pointerEvents: "auto"
        })
        .to(
          menu,
          {
            autoAlpha: 1,
            duration: 0.48,
            ease: "power2.out"
          },
          0
        )
        .to(
          panel,
          {
            yPercent: 0,
            scale: 1,
            duration: 0.9,
            ease: "expo.out"
          },
          0
        )
        .to(
          menuLinks,
          {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.72,
            stagger: 0.055,
            ease: "power4.out"
          },
          0.16
        )
        .to(
          rightItems,
          {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.7,
            stagger: 0.07,
            ease: "power4.out"
          },
          0.28
        );
  
      if (openIcon) {
        timeline.to(
          openIcon,
          {
            autoAlpha: 0,
            rotate: 90,
            scale: 0.72,
            duration: 0.35,
            ease: "power3.inOut"
          },
          0
        );
      }
  
      if (closeIcon) {
        timeline.to(
          closeIcon,
          {
            autoAlpha: 1,
            rotate: 0,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.6)"
          },
          0.08
        );
      }
    }
  
    function closeMenu() {
      if (!isOpen) return;
      isOpen = false;
  
      if (timeline) timeline.kill();
  
      menu.classList.remove("is-open");
      navbar?.classList.remove("is-menu-open");
      updateAccessibility(false);
  
      if (reduceMotion) {
        gsap.set(menu, {
          display: "none",
          autoAlpha: 0,
          pointerEvents: "none"
        });
        if (openIcon) gsap.set(openIcon, { autoAlpha: 1 });
        if (closeIcon) gsap.set(closeIcon, { autoAlpha: 0 });
        unlockPage();
        return;
      }
  
      timeline = gsap.timeline({
        defaults: {
          overwrite: "auto"
        },
        onComplete: unlockPage
      });
  
      timeline
        .to(
          [...menuLinks].reverse(),
          {
            y: "-0.75rem",
            autoAlpha: 0,
            filter: "blur(5px)",
            duration: 0.3,
            stagger: 0.02,
            ease: "power2.in"
          },
          0
        )
        .to(
          rightItems,
          {
            y: "-0.75rem",
            autoAlpha: 0,
            filter: "blur(5px)",
            duration: 0.28,
            stagger: 0.025,
            ease: "power2.in"
          },
          0
        )
        .to(
          panel,
          {
            yPercent: -3,
            scale: 1.01,
            duration: 0.6,
            ease: "expo.inOut"
          },
          0.08
        )
        .to(
          menu,
          {
            autoAlpha: 0,
            duration: 0.42,
            ease: "power2.inOut"
          },
          0.16
        )
        .set(menu, {
          display: "none",
          pointerEvents: "none"
        });
  
      if (closeIcon) {
        timeline.to(
          closeIcon,
          {
            autoAlpha: 0,
            rotate: -90,
            scale: 0.72,
            duration: 0.3,
            ease: "power3.inOut"
          },
          0
        );
      }
  
      if (openIcon) {
        timeline.to(
          openIcon,
          {
            autoAlpha: 1,
            rotate: 0,
            scale: 1,
            duration: 0.45,
            ease: "back.out(1.5)"
          },
          0.08
        );
      }
    }
  
    function toggleMenu() {
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }
  
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    });
  
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleMenu();
      }
    });
  
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen) {
        closeMenu();
      }
    });
  
    document.addEventListener("pointerdown", (event) => {
      if (!isOpen) return;
      if (panel.contains(event.target)) return;
      if (trigger.contains(event.target)) return;
      closeMenu();
    });
  
    menuLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }
  
  /* ========================================================================== 
     2. BUTTON HOVERS
  
     BOUTONS AVEC FLÈCHE :
     - allongement horizontal du SVG uniquement ;
     - léger déplacement horizontal du texte vers la droite ;
     - aucun déplacement du bouton ;
     - aucun zoom du fond ;
     - aucun remplacement vertical du texte.
  
     BOUTONS SANS FLÈCHE :
     - conservation du léger défilement vertical du double texte.
  ========================================================================== */
  
  function initButtons(reduceMotion) {
    if (reduceMotion) return;
  
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
  
    if (!canHover) return;
  
    gsap.utils.toArray(".btn").forEach((button) => {
      if (button.dataset.hoverReady === "true") return;
      button.dataset.hoverReady = "true";
  
      const textOverflow = button.querySelector(".text--overflow");
      const textTrack = button.querySelector(".btn-animate-chars__text");
      const arrowWrapper = button.querySelector(".btn--arrow-wrapper");
  
      const arrowIsVisible = Boolean(
        arrowWrapper &&
        getComputedStyle(arrowWrapper).display !== "none" &&
        getComputedStyle(arrowWrapper).visibility !== "hidden" &&
        arrowWrapper.getBoundingClientRect().width > 0
      );
  
      /*
        La classe ne s'applique qu'aux variantes dont la flèche est visible.
        Le bouton et son lien parent ne coupent donc plus l'animation.
      */
      if (arrowIsVisible) {
        button.classList.add("has-visible-arrow");
        button.closest(".inline-block")?.classList.add("has-visible-arrow");
      }
  
      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          duration: 0.58,
          ease: "expo.out",
          overwrite: "auto"
        }
      });
  
      /* Ancien hover : remplacement vertical des deux copies du texte. */
      if (textTrack && textTrack.children.length > 1) {
        timeline.to(
          textTrack,
          {
            yPercent: -100
          },
          0
        );
      }
  
      /*
        Variante avec flèche visible :
        - on augmente la vraie propriété width du wrapper ;
        - aucun scale n'est appliqué au SVG ;
        - le bloc texte se décale légèrement vers la droite ;
        - l'ancien slide vertical du texte reste conservé.
      */
      if (arrowIsVisible) {
        const baseArrowWidth = arrowWrapper.getBoundingClientRect().width;
        const extraArrowWidth = Math.max(8, parseFloat(
          getComputedStyle(document.documentElement).fontSize
        ) * 0.65);
  
        gsap.set(arrowWrapper, {
          width: baseArrowWidth,
          maxWidth: "none"
        });
  
        timeline.to(
          arrowWrapper,
          {
            width: baseArrowWidth + extraArrowWidth
          },
          0
        );
  
        if (textOverflow) {
          timeline.to(
            textOverflow,
            {
              x: "0.25rem"
            },
            0
          );
        }
      } else if (textTrack && textTrack.children.length <= 1) {
        timeline.to(
          textTrack,
          {
            x: "0.18rem"
          },
          0
        );
      }
  
      const play = () => timeline.play();
      const reverse = () => timeline.reverse();
  
      button.addEventListener("mouseenter", play);
      button.addEventListener("mouseleave", reverse);
      button.addEventListener("focusin", play);
      button.addEventListener("focusout", reverse);
    });
  
    /* Grand CTA : vraie augmentation de width, sans scale. */
    gsap.utils.toArray(".home--subhero-cta_inside").forEach((cta) => {
      if (cta.dataset.hoverReady === "true") return;
      cta.dataset.hoverReady = "true";
  
      const arrow = cta.querySelector(".arrow--60");
      const title = cta.querySelector("h2");
  
      if (!arrow && !title) return;
  
      cta.style.overflow = "visible";
  
      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          duration: 0.62,
          ease: "expo.out",
          overwrite: "auto"
        }
      });
  
      if (arrow && arrow.getBoundingClientRect().width > 0) {
        const baseWidth = arrow.getBoundingClientRect().width;
        const extraWidth = Math.max(10, parseFloat(
          getComputedStyle(document.documentElement).fontSize
        ) * 0.75);
  
        gsap.set(arrow, {
          width: baseWidth,
          maxWidth: "none",
          flex: "none",
          transform: "none"
        });
  
        timeline.to(
          arrow,
          {
            width: baseWidth + extraWidth
          },
          0
        );
      }
  
      if (title) {
        timeline.to(
          title,
          {
            x: "0.25rem"
          },
          0
        );
      }
  
      cta.addEventListener("mouseenter", () => timeline.play());
      cta.addEventListener("mouseleave", () => timeline.reverse());
      cta.addEventListener("focusin", () => timeline.play());
      cta.addEventListener("focusout", () => timeline.reverse());
    });
  }
  
  /* ========================================================================== 
     3. SPLIT TEXT SETUP
  ========================================================================== */
  
  function initSplitElements() {
    const elements = gsap.utils.toArray(
      '[animation="load-split"], [animation="fade-split"]'
    );
  
    elements.forEach((element) => {
      if (element.dataset.splitReady === "true") return;
      element.dataset.splitReady = "true";
  
      if (typeof SplitType !== "undefined") {
        const split = new SplitType(element, {
          types: "lines",
          lineClass: "split-line"
        });
  
        split.lines.forEach((line) => {
          const mask = document.createElement("span");
          mask.className = "split-line-mask";
  
          line.parentNode.insertBefore(mask, line);
          mask.appendChild(line);
        });
  
        element._splitTypeInstance = split;
        return;
      }
  
      /* Fallback : reveal du bloc entier si SplitType n'est pas présent. */
      const content = element.innerHTML;
      element.innerHTML =
        '<span class="split-line-mask">' +
        '<span class="split-line">' +
        content +
        "</span></span>";
    });
  }
  
  /* ========================================================================== 
     4. LOAD ANIMATIONS
  ========================================================================== */
  
  function initLoadAnimations(reduceMotion) {
    if (reduceMotion) {
      gsap.set('[animation^="load"]', {
        autoAlpha: 1,
        clearProps: "transform,filter"
      });
      return;
    }
  
    const timeline = gsap.timeline({
      defaults: {
        ease: "power4.out"
      },
      delay: 0.08
    });
  
    addLoadGroup(
      timeline,
      '[animation="load"]',
      { autoAlpha: 0, y: "0.75rem", filter: "blur(4px)" },
      0.08
    );
  
    addLoadGroup(
      timeline,
      '[animation="load-up"]',
      { autoAlpha: 0, y: "2rem", filter: "blur(5px)" },
      0.1
    );
  
    addLoadGroup(
      timeline,
      '[animation="load-down"]',
      { autoAlpha: 0, y: "-2rem", filter: "blur(5px)" },
      0.1
    );
  
    addLoadGroup(
      timeline,
      '[animation="load-left"]',
      { autoAlpha: 0, x: "-2rem", filter: "blur(5px)" },
      0.12
    );
  
    addLoadGroup(
      timeline,
      '[animation="load-right"]',
      { autoAlpha: 0, x: "2rem", filter: "blur(5px)" },
      0.12
    );
  
    addLoadGroup(
      timeline,
      '[animation="load-scale"]',
      { autoAlpha: 0, scale: 0.94, filter: "blur(5px)" },
      0.12
    );
  
    document.querySelectorAll('[animation="load-stagger"]').forEach((parent) => {
      const children = getDirectChildren(parent);
      if (!children.length) return;
  
      timeline.fromTo(
        children,
        {
          autoAlpha: 0,
          y: "1.5rem",
          filter: "blur(5px)"
        },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.08,
          ease: "power4.out"
        },
        0.16
      );
    });
  
    document.querySelectorAll('[animation="load-split"]').forEach((element) => {
      const lines = element.querySelectorAll(".split-line");
      if (!lines.length) return;
  
      timeline.fromTo(
        lines,
        {
          yPercent: 115,
          autoAlpha: 0,
          filter: "blur(5px)"
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.075,
          ease: "power4.out"
        },
        0.18
      );
    });
  }
  
  function addLoadGroup(timeline, selector, fromVars, position) {
    const elements = gsap.utils.toArray(selector);
    if (!elements.length) return;
  
    timeline.fromTo(
      elements,
      fromVars,
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.075,
        ease: "power4.out"
      },
      position
    );
  }
  
  /* ========================================================================== 
     5. SCROLL ANIMATIONS
  ========================================================================== */
  
  function initScrollAnimations(reduceMotion) {
    if (reduceMotion) return;
  
    if (typeof ScrollTrigger === "undefined") {
      console.warn("ScrollTrigger n'est pas chargé.");
      gsap.set('[animation^="fade"]', {
        autoAlpha: 1,
        clearProps: "transform,filter"
      });
      return;
    }
  
    createFade(
      '[animation="fade"]',
      { autoAlpha: 0, y: "0.75rem", filter: "blur(4px)" }
    );
  
    createFade(
      '[animation="fade-up"]',
      { autoAlpha: 0, y: "2rem", filter: "blur(5px)" }
    );
  
    createFade(
      '[animation="fade-down"]',
      { autoAlpha: 0, y: "-2rem", filter: "blur(5px)" }
    );
  
    createFade(
      '[animation="fade-left"]',
      { autoAlpha: 0, x: "-2rem", filter: "blur(5px)" }
    );
  
    createFade(
      '[animation="fade-right"]',
      { autoAlpha: 0, x: "2rem", filter: "blur(5px)" }
    );
  
    createFade(
      '[animation="fade-scale"]',
      { autoAlpha: 0, scale: 0.94, filter: "blur(5px)" }
    );
  
    initFadeStagger();
    initFadeSplit();
  }
  
  function createFade(selector, fromVars) {
    gsap.utils.toArray(selector).forEach((element) => {
      gsap.fromTo(
        element,
        fromVars,
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: {
            trigger: element,
            start: "top 84%",
            once: true
          }
        }
      );
    });
  }
  
  function initFadeStagger() {
    gsap.utils.toArray('[animation="fade-stagger"]').forEach((parent) => {
      const children = getDirectChildren(parent);
      if (!children.length) return;
  
      gsap.fromTo(
        children,
        {
          autoAlpha: 0,
          y: "1.6rem",
          filter: "blur(5px)"
        },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.09,
          ease: "power4.out",
          scrollTrigger: {
            trigger: parent,
            start: "top 84%",
            once: true
          }
        }
      );
    });
  }
  
  function initFadeSplit() {
    gsap.utils.toArray('[animation="fade-split"]').forEach((element) => {
      const lines = gsap.utils.toArray(
        element.querySelectorAll(".split-line")
      );
  
      if (!lines.length) return;
  
      gsap.fromTo(
        lines,
        {
          yPercent: 115,
          autoAlpha: 0,
          filter: "blur(5px)"
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.95,
          stagger: 0.075,
          ease: "power4.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
            once: true
          }
        }
      );
    });
  }