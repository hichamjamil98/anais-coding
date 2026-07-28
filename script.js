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
  initNavbarDropdowns(reduceMotion);
  initButtons(reduceMotion);
  initSocialLinks(reduceMotion);
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
   NAVBAR DROPDOWN — .drop--menu.navbar--drop

   Desktop : ouverture au hover et au focus.
   Tablette/mobile : ouverture au clic.
   La position et les dimensions restent entièrement gérées dans Webflow.
========================================================================== */

function initNavbarDropdowns(reduceMotion) {
  const dropdowns = gsap.utils.toArray(
    ".nav--menu > .inline-block.navbar--drop"
  );

  if (!dropdowns.length) return;

  const desktopMedia = window.matchMedia(
    "(min-width: 992px) and (hover: hover) and (pointer: fine)"
  );

  dropdowns.forEach((dropdown) => {
    if (dropdown.dataset.dropdownReady === "true") return;
    dropdown.dataset.dropdownReady = "true";

    /*
      Les <defs> placés directement dans le wrapper n'ont aucun rôle visuel
      et peuvent créer un espace dans le layout mobile.
    */
    dropdown
      .querySelectorAll(":scope > defs, :scope > .defs")
      .forEach((defs) => {
        defs.style.display = "none";
        defs.style.width = "0";
        defs.style.height = "0";
        defs.setAttribute("aria-hidden", "true");
      });

    const trigger = dropdown.querySelector(":scope > .btn");
    const menu = dropdown.querySelector(
      ":scope > .drop--menu.navbar--drop"
    );

    if (!trigger || !menu) return;

    const links = gsap.utils.toArray(menu.querySelectorAll(".drop--link"));
    const dividers = gsap.utils.toArray(menu.querySelectorAll(".divider"));

    let isOpen = false;
    let timeline = null;
    let closeTimeout = null;

    dropdown.setAttribute("role", "group");
    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");

    function setClosedDisplay() {
      if (desktopMedia.matches) {
        /* Desktop : la géométrie reste entièrement celle de Webflow. */
        gsap.set(menu, {
          clearProps:
            "display,width,height,minWidth,minHeight,maxWidth,maxHeight," +
            "margin,padding,border,overflow,lineHeight"
        });
        return;
      }

      /*
        Mobile/tablette : on retire réellement le dropdown du flux.
        Les propriétés directes sécurisent le résultat même si Webflow
        ou une ancienne animation GSAP a laissé des styles inline.
      */
      menu.style.setProperty("display", "none", "important");
      menu.style.setProperty("width", "0", "important");
      menu.style.setProperty("height", "0", "important");
      menu.style.setProperty("min-width", "0", "important");
      menu.style.setProperty("min-height", "0", "important");
      menu.style.setProperty("max-width", "0", "important");
      menu.style.setProperty("max-height", "0", "important");
      menu.style.setProperty("margin", "0", "important");
      menu.style.setProperty("padding", "0", "important");
      menu.style.setProperty("border", "0", "important");
      menu.style.setProperty("overflow", "hidden", "important");
      menu.style.setProperty("line-height", "0", "important");
    }

    function setOpenDisplay() {
      if (desktopMedia.matches) {
        gsap.set(menu, {
          clearProps:
            "display,width,height,minWidth,minHeight,maxWidth,maxHeight," +
            "margin,padding,border,overflow,lineHeight"
        });
        return;
      }

      [
        "width",
        "height",
        "min-width",
        "min-height",
        "max-width",
        "max-height",
        "margin",
        "padding",
        "border",
        "overflow",
        "line-height"
      ].forEach((property) => menu.style.removeProperty(property));

      menu.style.setProperty("display", "block", "important");
    }

    /* Aucun x, y ou transform n'est appliqué au menu. */
    gsap.set(menu, {
      autoAlpha: 0,
      pointerEvents: "none"
    });
    setClosedDisplay();

    gsap.set(links, {
      y: "0.75rem",
      autoAlpha: 0,
      filter: "blur(4px)"
    });

    gsap.set(dividers, {
      scaleX: 0,
      transformOrigin: "left center"
    });

    function updateAccessibility(open) {
      trigger.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
    }

    function clearCloseTimeout() {
      if (!closeTimeout) return;
      window.clearTimeout(closeTimeout);
      closeTimeout = null;
    }

    function closeOtherDropdowns() {
      dropdowns.forEach((otherDropdown) => {
        if (otherDropdown === dropdown) return;
        otherDropdown.dispatchEvent(
          new CustomEvent("navbar-dropdown-close")
        );
      });
    }

    function openDropdown() {
      clearCloseTimeout();
      if (isOpen) return;

      isOpen = true;
      closeOtherDropdowns();

      if (timeline) timeline.kill();

      dropdown.classList.add("is-drop-open");
      setOpenDisplay();
      updateAccessibility(true);

      if (reduceMotion) {
        gsap.set(menu, {
          autoAlpha: 1,
          pointerEvents: "auto"
        });
        gsap.set(links, {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)"
        });
        gsap.set(dividers, { scaleX: 1 });
        return;
      }

      timeline = gsap.timeline({
        defaults: { overwrite: "auto" }
      });

      timeline.fromTo(
        menu,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          pointerEvents: "auto",
          duration: 0.4,
          ease: "power2.out"
        },
        0
      );

      timeline.fromTo(
        links,
        {
          y: "0.75rem",
          autoAlpha: 0,
          filter: "blur(4px)"
        },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.55,
          stagger: 0.06,
          ease: "power4.out"
        },
        0.08
      );

      if (dividers.length) {
        timeline.to(
          dividers,
          {
            scaleX: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "power3.out"
          },
          0.12
        );
      }
    }

    function closeDropdown(immediate = false) {
      clearCloseTimeout();
      if (!isOpen) {
        setClosedDisplay();
        return;
      }

      isOpen = false;
      if (timeline) timeline.kill();
      updateAccessibility(false);

      function finalizeClose() {
        dropdown.classList.remove("is-drop-open");
        gsap.set(menu, {
          autoAlpha: 0,
          pointerEvents: "none"
        });
        setClosedDisplay();
      }

      if (reduceMotion || immediate) {
        finalizeClose();
        gsap.set(links, {
          y: "0.75rem",
          autoAlpha: 0,
          filter: "blur(4px)"
        });
        gsap.set(dividers, { scaleX: 0 });
        return;
      }

      timeline = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: finalizeClose
      });

      timeline.to(
        [...links].reverse(),
        {
          y: "-0.4rem",
          autoAlpha: 0,
          filter: "blur(4px)",
          duration: 0.22,
          stagger: 0.025,
          ease: "power2.in"
        },
        0
      );

      if (dividers.length) {
        timeline.to(
          [...dividers].reverse(),
          {
            scaleX: 0,
            duration: 0.22,
            stagger: 0.02,
            ease: "power2.in"
          },
          0
        );
      }

      timeline.to(
        menu,
        {
          autoAlpha: 0,
          pointerEvents: "none",
          duration: 0.3,
          ease: "power2.in"
        },
        0.05
      );
    }

    function delayedClose() {
      clearCloseTimeout();
      closeTimeout = window.setTimeout(() => closeDropdown(), 140);
    }

    function toggleDropdown() {
      isOpen ? closeDropdown() : openDropdown();
    }

    dropdown.addEventListener("mouseenter", () => {
      if (!desktopMedia.matches) return;
      openDropdown();
    });

    dropdown.addEventListener("mouseleave", () => {
      if (!desktopMedia.matches) return;
      delayedClose();
    });

    trigger.addEventListener("click", (event) => {
      if (desktopMedia.matches) return;
      event.preventDefault();
      event.stopPropagation();
      toggleDropdown();
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        openDropdown();
        links[0]?.focus();
      }

      if (
        !desktopMedia.matches &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        toggleDropdown();
      }

      if (event.key === "Escape") {
        closeDropdown();
        trigger.focus();
      }
    });

    dropdown.addEventListener("focusin", () => {
      if (!desktopMedia.matches) return;
      openDropdown();
    });

    dropdown.addEventListener("focusout", (event) => {
      if (!desktopMedia.matches) return;
      if (dropdown.contains(event.relatedTarget)) return;
      delayedClose();
    });

    links.forEach((link) => {
      link.addEventListener("click", () => closeDropdown(true));
    });

    dropdown.addEventListener("navbar-dropdown-close", () => {
      closeDropdown();
    });

    document.addEventListener("pointerdown", (event) => {
      if (!isOpen) return;
      if (dropdown.contains(event.target)) return;
      closeDropdown();
    });

    desktopMedia.addEventListener("change", () => {
      if (timeline) timeline.kill();
      isOpen = false;
      updateAccessibility(false);
      dropdown.classList.remove("is-drop-open");
      gsap.set(menu, {
        autoAlpha: 0,
        pointerEvents: "none"
      });
      setClosedDisplay();
    });
  });
}

/* ========================================================================== 
   2. BUTTON HOVERS — ANCIEN COMPORTEMENT POUR TOUS

   - le double texte monte verticalement ;
   - la flèche conserve son ancien léger déplacement ;
   - aucun calcul spécial de width ;
   - aucun traitement différent selon la visibilité de la flèche.
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

    const textTrack = button.querySelector(".btn-animate-chars__text");
    const arrowWrapper = button.querySelector(".btn--arrow-wrapper");

    const timeline = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.58,
        ease: "expo.out",
        overwrite: "auto"
      }
    });

    if (textTrack && textTrack.children.length > 1) {
      timeline.to(
        textTrack,
        {
          yPercent: -100
        },
        0
      );
    }

    if (arrowWrapper) {
      timeline.to(
        arrowWrapper,
        {
          x: "0.35rem"
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

  gsap.utils.toArray(".home--subhero-cta_inside").forEach((cta) => {
    if (cta.dataset.hoverReady === "true") return;
    cta.dataset.hoverReady = "true";

    const arrow = cta.querySelector(".arrow--60");
    const title = cta.querySelector("h2");

    if (!arrow && !title) return;

    const timeline = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.62,
        ease: "expo.out",
        overwrite: "auto"
      }
    });

    if (arrow) {
      timeline.to(arrow, { x: "0.4rem" }, 0);
    }

    if (title) {
      timeline.to(title, { x: "0.25rem" }, 0);
    }

    cta.addEventListener("mouseenter", () => timeline.play());
    cta.addEventListener("mouseleave", () => timeline.reverse());
    cta.addEventListener("focusin", () => timeline.play());
    cta.addEventListener("focusout", () => timeline.reverse());
  });
}

/* ========================================================================== 
   3. SOCIAL LINKS — LOGO ABSOLU, AUCUN REFLOW

   Au repos : seul le texte est visible.
   Au hover : le logo arrive depuis le haut, au-dessus du texte.
   Le lien ne change jamais de largeur ni de hauteur.
========================================================================== */

function initSocialLinks(reduceMotion) {
  const links = gsap.utils.toArray(".social--link");
  if (!links.length) return;

  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  links.forEach((link) => {
    const logo = link.querySelector(":scope > .social--logo");
    const text = link.querySelector(":scope > div");

    if (!logo || !text) return;

    /* Nettoie les anciens styles inline des versions précédentes. */
    gsap.set(link, {
      clearProps: "width,height,minWidth,minHeight"
    });

    gsap.set(text, {
      clearProps: "transform,opacity,visibility,left,top"
    });

    gsap.set(logo, {
      clearProps: "transform,opacity,visibility,left,top"
    });

    /*
     * Le logo conserve exactement les dimensions Webflow.
     * Il est seulement centré horizontalement et placé hors du flux.
     */
    gsap.set(logo, {
      xPercent: -50,
      x: 0,
      y: "-0.55rem",
      autoAlpha: 0,
      pointerEvents: "none"
    });

    gsap.set(text, {
      x: 0,
      y: 0,
      autoAlpha: 1
    });

    link.dataset.socialHoverReady = "true";

    if (reduceMotion || !canHover) return;

    const timeline = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.62,
        ease: "power4.out",
        overwrite: "auto"
      }
    });

    timeline
      .to(
        logo,
        {
          y: 0,
          autoAlpha: 1
        },
        0
      )
      .to(
        text,
        {
          y: "0.12rem"
        },
        0
      );

    const open = () => timeline.play();
    const close = () => timeline.reverse();

    link.addEventListener("mouseenter", open);
    link.addEventListener("mouseleave", close);
    link.addEventListener("focusin", open);
    link.addEventListener("focusout", close);
  });
}

/* ========================================================================== 
   4. SPLIT TEXT SETUP
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