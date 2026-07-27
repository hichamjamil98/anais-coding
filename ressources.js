/* ==========================================================================
   RESSOURCES — ROW MASKS
   ressources.js
========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initResourcesRowMasks();
  });
  
  /* ==========================================================================
     CREATE ONE FULL-VIEWPORT MASK AT THE BOTTOM OF EACH CMS GRID ROW
  ========================================================================== */
  
  function initResourcesRowMasks() {
    const section = document.querySelector(".section.is--about-tab");
    if (!section) return;
  
    const grid = section.querySelector(".grid--6cl");
    if (!grid) return;
  
    const template = section.querySelector(".row--mask");
  
    let resizeTimer = null;
    let observer = null;
  
    function removeGeneratedMasks() {
      section
        .querySelectorAll(".resources-row-mask")
        .forEach((mask) => mask.remove());
    }
  
    function getGridItems() {
      return Array.from(grid.children).filter((item) => {
        const style = window.getComputedStyle(item);
  
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          item.getBoundingClientRect().height > 0
        );
      });
    }
  
    function groupItemsByVisualRow(items) {
      const rows = [];
      const tolerance = 4;
  
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const top = rect.top;
  
        let row = rows.find(
          (currentRow) => Math.abs(currentRow.top - top) <= tolerance
        );
  
        if (!row) {
          row = {
            top,
            items: []
          };
  
          rows.push(row);
        }
  
        row.items.push(item);
      });
  
      return rows.sort((a, b) => a.top - b.top);
    }
  
    function createMask() {
      let mask;
  
      if (template) {
        mask = template.cloneNode(true);
        mask.removeAttribute("id");
        mask.classList.remove("row--mask");
      } else {
        mask = document.createElement("div");
      }
  
      mask.classList.add("resources-row-mask");
      mask.removeAttribute("style");
      mask.setAttribute("aria-hidden", "true");
  
      return mask;
    }
  
    function buildRowMasks() {
      removeGeneratedMasks();
  
      const items = getGridItems();
      if (!items.length) return;
  
      const rows = groupItemsByVisualRow(items);
      const sectionRect = section.getBoundingClientRect();
  
      rows.forEach((row) => {
        /*
         * Use the lowest card bottom in the row.
         * This works even if cards have different content heights.
         */
        const rowBottom = Math.max(
          ...row.items.map((item) => item.getBoundingClientRect().bottom)
        );
  
        const mask = createMask();
  
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
  
    /*
     * Wait for images because their final dimensions can change row heights.
     */
    const images = grid.querySelectorAll("img");
  
    images.forEach((image) => {
      if (!image.complete) {
        image.addEventListener("load", scheduleBuild, {
          once: true
        });
      }
    });
  
    /*
     * Rebuild when the grid or CMS content changes.
     */
    observer = new MutationObserver(scheduleBuild);
  
    observer.observe(grid, {
      childList: true,
      subtree: true
    });
  
    window.addEventListener("resize", scheduleBuild);
    window.addEventListener("load", scheduleBuild);
  
    buildRowMasks();
  }