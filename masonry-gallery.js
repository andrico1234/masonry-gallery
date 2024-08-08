const COLUMN_CLASS_NAME = 'masonry-gallery-column'
const CUSTOM_ELEMENT_NAME = 'masonry-gallery'

function isEmpty(obj) {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;
};


function debounce(func, wait) {
  let timeout;

  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timeout);

    if (!timeout) func.apply(context, args);

    timeout = setTimeout(function () {
      timeout = null;

      func.apply(context, args);
    }, wait);
  };
}

class MasonryGallery extends HTMLElement {
  static observedAttributes = ["columns"];

  loadedImages = {}

  static register(tagName) {
    if ("customElements" in window) {
      customElements.define(tagName || CUSTOM_ELEMENT_NAME, MasonryGallery);
    }
  }

  connectedCallback() {
    if (document.readyState === "loading") {
      return document.addEventListener("readystatechange", this.connectedCallback, { once: true })
    }

    if (this.children.length === 0) {
      console.warn("No children found in the masonry gallery")
    }

    this.mutationObserver = new MutationObserver(this._mutationObserverCallback);
    this.mutationObserver.observe(this, {
      childList: true
    });

    this.addEventListener("load", this.onLoad, { capture: true })
    this._elClone = this.cloneNode(true);
    this.generateLayout();
  }

  disconnectedCallback() {
    this.removeEventListener("load", this.onLoad, { capture: true })
    this.mutationObserver.disconnect();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "columns" && oldValue !== newValue) {
      this.generateLayout();
    }
  }

  _mutationObserverCallback = (entries) => {
    for (const entry of entries) {
      let imgEls = [];

      for (const node of entry.addedNodes) {
        if (entry.target.matches(CUSTOM_ELEMENT_NAME) && !node.classList.contains(COLUMN_CLASS_NAME)) {
          this._elClone.appendChild(node)
          this.generateLayout();
        }
      }

      for (const node of entry.removedNodes) {
        if (entry.target.matches(`.${COLUMN_CLASS_NAME}`)) {
          for (const c of this._elClone.children) {

            if (c.outerHTML === node.outerHTML) {
              c.remove();
              this.generateLayout();
            }
          }
        }
      }
    }
  }

  onLoad(event) {
    // Do I need to consider other resource types too?
    if (event.target.tagName.toLowerCase() === "img") {
      const src = event.target.getAttribute("src");
      this.loadedImages[src]

      if (this.loadedImages[src]) {
        return
      }

      this.loadedImages[src] = event.target.offsetHeight;
      this.generateLayout();
    }
  }

  generateLayout = debounce(this._generateLayout, 200);

  _generateLayout() {
    if (!this._elClone) return;

    const children = this._elClone.cloneNode(true).children;
    const colCount = Number(this.getAttribute("columns") || 3);

    const docFrag = document.createDocumentFragment();
    const columns = Array.from({ length: colCount }, () => {
      const div = document.createElement('div');
      div.classList.add(COLUMN_CLASS_NAME)
      docFrag.appendChild(div);

      this.mutationObserver.observe(div, { childList: true });

      return div;
    })

    const colHeights = Array.from({ length: colCount }, () => 0);

    const haveImagesLoaded = !isEmpty(this.loadedImages);

    let currI = 0;
    while (children.length) {
      const child = children[0];
      const src = child.getAttribute("src");
      const height = this.loadedImages[src] || 0;
      
      const shortestColumnIndex = colHeights.indexOf(Math.min(...colHeights));
      const lruIndex = currI % columns.length;
      const i = haveImagesLoaded ? shortestColumnIndex : lruIndex;

      columns[i].appendChild(child);
      colHeights[i] += height;

      currI++;
    }

    this.replaceChildren(docFrag);

    this.style.display = "flex";
    this.style.justifyContent = "space-between";
  }
}

MasonryGallery.register();
