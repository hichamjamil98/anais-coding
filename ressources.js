document.addEventListener("DOMContentLoaded", () => {
    initResourcesRowMasks();
  });
  
  function initResourcesRowMasks() {
    const section = document.querySelector(".section.is--about-tab");
    if (!section) return;
  
    const grid = section.querySelector(".grid--6cl");
    if (!grid) return;
  
    /*
     * Supporte les deux noms :
     * .row--mask ou .resources-row-mask
     */
    const template =
      section.querySelector(".row--mask") ||
      section.querySelector(
        ".resources-row-mask:not(.is--generated)"
      );
  
    if (!template) {
      console.warn(
        'Ajoute un élément modèle avec la classe ".row--mask" ou ".resources-row-mask".'
      );
      return;
    }
  
    let resizeTimer;
  
    function removeGeneratedMasks() {
      section
        .querySelectorAll(".resources-row-mask.is--generated")
        .forEach((mask) => mask.remove());
    }
  
    function getVisibleItems() {
      return Array.from(grid.children).filter((item) => {
        const style = getComputedStyle(item);
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
          (candidate) =>
            Math.abs(candidate.top - rect.top) <= tolerance
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
  
    function createMask() {
      const mask = template.cloneNode(true);
  
      mask.removeAttribute("id");
      mask.removeAttribute("style");
      mask.removeAttribute("hidden");
  
      mask.classList.add(
        "resources-row-mask",
        "is--generated"
      );
  
      mask.setAttribute("aria-hidden", "true");
  
      return mask;
    }
  
    function buildMasks() {
      removeGeneratedMasks();
  
      const items = getVisibleItems();
      if (!items.length) return;
  
      const rows = groupItemsByRow(items);
      const sectionRect = section.getBoundingClientRect();
  
      rows.forEach((row) => {
        const rowBottom = Math.max(
          ...row.items.map(
            (item) => item.getBoundingClientRect().bottom
          )
        );
  
        const mask = createMask();
  
        /*
         * On ajoute d'abord le masque au DOM pour récupérer
         * sa vraie hauteur définie dans Webflow.
         */
        section.appendChild(mask);
  
        const maskHeight =
          mask.getBoundingClientRect().height;
  
        /*
         * Le bas du masque est aligné avec le bas de la rangée.
         *
         * Exemple :
         * rowBottom = 700
         * maskHeight = 120
         * top = 580
         *
         * Le masque couvre donc les 120 derniers pixels de la rangée.
         */
        const top =
          rowBottom -
          sectionRect.top -
          maskHeight;
  
        mask.style.top = `${top}px`;
      });
    }
  
    function scheduleBuild() {
      clearTimeout(resizeTimer);
  
      resizeTimer = setTimeout(() => {
        requestAnimationFrame(buildMasks);
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
  
    buildMasks();
  }