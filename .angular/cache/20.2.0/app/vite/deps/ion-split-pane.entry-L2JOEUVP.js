import {
  getIonMode
} from "./chunk-GY2AZYBV.js";
import {
  Host,
  createEvent,
  getElement,
  h,
  printIonWarning,
  registerInstance
} from "./chunk-EUKJBSCI.js";
import {
  __async
} from "./chunk-UL2P3LPA.js";

// node_modules/@ionic/core/dist/esm/ion-split-pane.entry.js
var splitPaneIosCss = ":host{--side-width:100%;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:nowrap;flex-wrap:nowrap;contain:strict}:host(.split-pane-visible) ::slotted(.split-pane-main){left:0;right:0;top:0;bottom:0;position:relative;-ms-flex:1;flex:1;-webkit-box-shadow:none;box-shadow:none;overflow:hidden;z-index:0}::slotted(.split-pane-side:not(ion-menu)){display:none}:host{--border:0.55px solid var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-250, var(--ion-background-color-step-250, #c8c7cc))));--side-min-width:270px;--side-max-width:28%}";
var splitPaneMdCss = ":host{--side-width:100%;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:nowrap;flex-wrap:nowrap;contain:strict}:host(.split-pane-visible) ::slotted(.split-pane-main){left:0;right:0;top:0;bottom:0;position:relative;-ms-flex:1;flex:1;-webkit-box-shadow:none;box-shadow:none;overflow:hidden;z-index:0}::slotted(.split-pane-side:not(ion-menu)){display:none}:host{--border:1px solid var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-150, var(--ion-background-color-step-150, rgba(0, 0, 0, 0.13)))));--side-min-width:270px;--side-max-width:28%}";
var SPLIT_PANE_MAIN = "split-pane-main";
var SPLIT_PANE_SIDE = "split-pane-side";
var QUERY = {
  xs: "(min-width: 0px)",
  sm: "(min-width: 576px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 992px)",
  xl: "(min-width: 1200px)",
  never: ""
};
var SplitPane = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.ionSplitPaneVisible = createEvent(this, "ionSplitPaneVisible", 7);
    this.visible = false;
    this.disabled = false;
    this.when = QUERY["lg"];
  }
  visibleChanged(visible) {
    this.ionSplitPaneVisible.emit({ visible });
  }
  /**
   * @internal
   */
  isVisible() {
    return __async(this, null, function* () {
      return Promise.resolve(this.visible);
    });
  }
  connectedCallback() {
    return __async(this, null, function* () {
      if (typeof customElements !== "undefined" && customElements != null) {
        yield customElements.whenDefined("ion-split-pane");
      }
      this.styleMainElement();
      this.updateState();
    });
  }
  disconnectedCallback() {
    if (this.rmL) {
      this.rmL();
      this.rmL = void 0;
    }
  }
  updateState() {
    if (this.rmL) {
      this.rmL();
      this.rmL = void 0;
    }
    if (this.disabled) {
      this.visible = false;
      return;
    }
    const query = this.when;
    if (typeof query === "boolean") {
      this.visible = query;
      return;
    }
    const mediaQuery = QUERY[query] || query;
    if (mediaQuery.length === 0) {
      this.visible = false;
      return;
    }
    const callback = (q) => {
      this.visible = q.matches;
    };
    const mediaList = window.matchMedia(mediaQuery);
    mediaList.addListener(callback);
    this.rmL = () => mediaList.removeListener(callback);
    this.visible = mediaList.matches;
  }
  /**
   * Attempt to find the main content
   * element inside of the split pane.
   * If found, set it as the main node.
   *
   * We assume that the main node
   * is available in the DOM on split
   * pane load.
   */
  styleMainElement() {
    const contentId = this.contentId;
    const children = this.el.children;
    const nu = this.el.childElementCount;
    let foundMain = false;
    for (let i = 0; i < nu; i++) {
      const child = children[i];
      const isMain = contentId !== void 0 && child.id === contentId;
      if (isMain) {
        if (foundMain) {
          printIonWarning("[ion-split-pane] - Cannot have more than one main node.");
          return;
        } else {
          setPaneClass(child, isMain);
          foundMain = true;
        }
      }
    }
    if (!foundMain) {
      printIonWarning("[ion-split-pane] - Does not have a specified main node.");
    }
  }
  render() {
    const mode = getIonMode(this);
    return h(Host, { key: "d5e30df12f1f1f855da4c66f98076b9dce762c59", class: {
      [mode]: true,
      // Used internally for styling
      [`split-pane-${mode}`]: true,
      "split-pane-visible": this.visible
    } }, h("slot", { key: "3e30d7cf3bc1cf434e16876a0cb2a36377b8e00f" }));
  }
  get el() {
    return getElement(this);
  }
  static get watchers() {
    return {
      "visible": ["visibleChanged"],
      "disabled": ["updateState"],
      "when": ["updateState"]
    };
  }
};
var setPaneClass = (el, isMain) => {
  let toAdd;
  let toRemove;
  if (isMain) {
    toAdd = SPLIT_PANE_MAIN;
    toRemove = SPLIT_PANE_SIDE;
  } else {
    toAdd = SPLIT_PANE_SIDE;
    toRemove = SPLIT_PANE_MAIN;
  }
  const classList = el.classList;
  classList.add(toAdd);
  classList.remove(toRemove);
};
SplitPane.style = {
  ios: splitPaneIosCss,
  md: splitPaneMdCss
};
export {
  SplitPane as ion_split_pane
};
/*! Bundled license information:

@ionic/core/dist/esm/ion-split-pane.entry.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
//# sourceMappingURL=ion-split-pane.entry-L2JOEUVP.js.map
