document.addEventListener("DOMContentLoaded", () => {
    initResourcesRowMasks();
  });
  
  function initResourcesRowMasks() {
    const section = document.querySelector(".section.is--about-tab");
    if (!section) return;
  
    const grid = section.querySelector(".grid--6cl");
    if (!grid) return;
  
    const template = section.querySelector(".row--mask");
    if (!template) {
      console.warn('Missing ".row--mask" template.');
      return;
    }
  
    let resizeTimer;
  
    function removeGeneratedMasks() {
      section
        .querySelectorAll(".resources-row-mask")
        .forEach((mask) => mask.remove());
    }
  
    function getVisibleGridItems() {
      return Array.from(grid.children).filter((item) => {
        const style = window.getComputedStyle(item);
        const rect = item.getBoundingClientRect();
  
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0
        );
      });
    }
  
    function groupItemsByRow(items) {
      const rows = [];
      const tolerance = 4;
  
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
  
        let row = rows.find(
          (candidate) => Math.abs(candidate.top - rect.top) <= tolerance
        );
  
        if (!row) {
          row = {
            top: rect.top,
            items: []
          };
  
          rows.push(row);
        }
  
        row.items.push(item);
      });
  
      return rows.sort((a, b) => a.top - b.top);
    }
  
    function cloneMask() {
      const mask = template.cloneNode(true);
  
      /*
       * On conserve volontairement la classe .row--mask.
       * Le clone garde ainsi la hauteur, le fond, le radius
       * et tous les autres styles configurés dans Webflow.
       */
      mask.classList.add("resources-row-mask");
  
      mask.removeAttribute("id");
      mask.removeAttribute("style");
      mask.removeAttribute("hidden");
  
      mask.setAttribute("aria-hidden", "true");
  
      return mask;
    }
  
    function buildRowMasks() {
      removeGeneratedMasks();
  
      const items = getVisibleGridItems();
      if (!items.length) return;
  
      const rows = groupItemsByRow(items);
      const sectionRect = section.getBoundingClientRect();
  
      rows.forEach((row) => {
        const rowBottom = Math.max(
          ...row.items.map(
            (item) => item.getBoundingClientRect().bottom
          )
        );
  
        const mask = cloneMask();
  
        /*
         * Le haut du masque commence exactement au bas
         * de la ligne du grid.
         */
        mask.style.top = `${rowBottom - sectionRect.top}px`;
  
        section.appendChild(mask);
      });
    }
  
    function scheduleBuild() {
      window.clearTimeout(resizeTimer);
  
      resizeTimer = window.setTimeout(() => {
        window.requestAnimationFrame(buildRowMasks);
      }, 120);
    }
  
    grid.querySelectorAll("img").forEach((image) => {
      if (!image.complete) {
        image.addEventListener("load", scheduleBuild, {
          once: true
        });
      }
    });
  
    const observer = new MutationObserver(scheduleBuild);
  
    observer.observe(grid, {
      childList: true,
      subtree: true
    });
  
    window.addEventListener("resize", scheduleBuild);
    window.addEventListener("load", scheduleBuild);
  
    buildRowMasks();
  }