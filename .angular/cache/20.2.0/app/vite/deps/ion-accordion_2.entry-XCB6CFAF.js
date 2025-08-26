import {
  chevronDown
} from "./chunk-IUTD4BIB.js";
import {
  getIonMode
} from "./chunk-GY2AZYBV.js";
import {
  addEventListener,
  getElementRoot,
  raf,
  removeEventListener,
  transitionEndAsync
} from "./chunk-4EKUW6KP.js";
import {
  Host,
  config,
  createEvent,
  getElement,
  h,
  printIonWarning,
  registerInstance
} from "./chunk-EUKJBSCI.js";
import {
  __async
} from "./chunk-UL2P3LPA.js";

// node_modules/@ionic/core/dist/esm/ion-accordion_2.entry.js
var accordionIosCss = ":host{display:block;position:relative;width:100%;background-color:var(--ion-background-color, #ffffff);overflow:hidden;z-index:0}:host(.accordion-expanding) ::slotted(ion-item[slot=header]),:host(.accordion-expanded) ::slotted(ion-item[slot=header]){--border-width:0px}:host(.accordion-animated){-webkit-transition:all 300ms cubic-bezier(0.25, 0.8, 0.5, 1);transition:all 300ms cubic-bezier(0.25, 0.8, 0.5, 1)}:host(.accordion-animated) #content{-webkit-transition:max-height 300ms cubic-bezier(0.25, 0.8, 0.5, 1);transition:max-height 300ms cubic-bezier(0.25, 0.8, 0.5, 1)}#content{overflow:hidden;will-change:max-height}:host(.accordion-collapsing) #content{max-height:0 !important}:host(.accordion-collapsed) #content{display:none}:host(.accordion-expanding) #content{max-height:0}:host(.accordion-expanding) #content-wrapper{overflow:auto}:host(.accordion-disabled) #header,:host(.accordion-readonly) #header,:host(.accordion-disabled) #content,:host(.accordion-readonly) #content{pointer-events:none}:host(.accordion-disabled) #header,:host(.accordion-disabled) #content{opacity:0.4}@media (prefers-reduced-motion: reduce){:host,#content{-webkit-transition:none !important;transition:none !important}}:host(.accordion-next) ::slotted(ion-item[slot=header]){--border-width:0.55px 0px 0.55px 0px}";
var accordionMdCss = ":host{display:block;position:relative;width:100%;background-color:var(--ion-background-color, #ffffff);overflow:hidden;z-index:0}:host(.accordion-expanding) ::slotted(ion-item[slot=header]),:host(.accordion-expanded) ::slotted(ion-item[slot=header]){--border-width:0px}:host(.accordion-animated){-webkit-transition:all 300ms cubic-bezier(0.25, 0.8, 0.5, 1);transition:all 300ms cubic-bezier(0.25, 0.8, 0.5, 1)}:host(.accordion-animated) #content{-webkit-transition:max-height 300ms cubic-bezier(0.25, 0.8, 0.5, 1);transition:max-height 300ms cubic-bezier(0.25, 0.8, 0.5, 1)}#content{overflow:hidden;will-change:max-height}:host(.accordion-collapsing) #content{max-height:0 !important}:host(.accordion-collapsed) #content{display:none}:host(.accordion-expanding) #content{max-height:0}:host(.accordion-expanding) #content-wrapper{overflow:auto}:host(.accordion-disabled) #header,:host(.accordion-readonly) #header,:host(.accordion-disabled) #content,:host(.accordion-readonly) #content{pointer-events:none}:host(.accordion-disabled) #header,:host(.accordion-disabled) #content{opacity:0.4}@media (prefers-reduced-motion: reduce){:host,#content{-webkit-transition:none !important;transition:none !important}}";
var Accordion = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.updateListener = () => this.updateState(false);
    this.state = 1;
    this.isNext = false;
    this.isPrevious = false;
    this.value = `ion-accordion-${accordionIds++}`;
    this.disabled = false;
    this.readonly = false;
    this.toggleIcon = chevronDown;
    this.toggleIconSlot = "end";
    this.setItemDefaults = () => {
      const ionItem = this.getSlottedHeaderIonItem();
      if (!ionItem) {
        return;
      }
      ionItem.button = true;
      ionItem.detail = false;
      if (ionItem.lines === void 0) {
        ionItem.lines = "full";
      }
    };
    this.getSlottedHeaderIonItem = () => {
      const { headerEl } = this;
      if (!headerEl) {
        return;
      }
      const slot = headerEl.querySelector("slot");
      if (!slot) {
        return;
      }
      if (slot.assignedElements === void 0)
        return;
      return slot.assignedElements().find((el) => el.tagName === "ION-ITEM");
    };
    this.setAria = (expanded = false) => {
      const ionItem = this.getSlottedHeaderIonItem();
      if (!ionItem) {
        return;
      }
      const root = getElementRoot(ionItem);
      const button = root.querySelector("button");
      if (!button) {
        return;
      }
      button.setAttribute("aria-expanded", `${expanded}`);
    };
    this.slotToggleIcon = () => {
      const ionItem = this.getSlottedHeaderIonItem();
      if (!ionItem) {
        return;
      }
      const { toggleIconSlot, toggleIcon } = this;
      const existingToggleIcon = ionItem.querySelector(".ion-accordion-toggle-icon");
      if (existingToggleIcon) {
        return;
      }
      const iconEl = document.createElement("ion-icon");
      iconEl.slot = toggleIconSlot;
      iconEl.lazy = false;
      iconEl.classList.add("ion-accordion-toggle-icon");
      iconEl.icon = toggleIcon;
      iconEl.setAttribute("aria-hidden", "true");
      ionItem.appendChild(iconEl);
    };
    this.expandAccordion = (initialUpdate = false) => {
      const { contentEl, contentElWrapper } = this;
      if (initialUpdate || contentEl === void 0 || contentElWrapper === void 0) {
        this.state = 4;
        return;
      }
      if (this.state === 4) {
        return;
      }
      if (this.currentRaf !== void 0) {
        cancelAnimationFrame(this.currentRaf);
      }
      if (this.shouldAnimate()) {
        raf(() => {
          this.state = 8;
          this.currentRaf = raf(() => __async(this, null, function* () {
            const contentHeight = contentElWrapper.offsetHeight;
            const waitForTransition = transitionEndAsync(contentEl, 2e3);
            contentEl.style.setProperty("max-height", `${contentHeight}px`);
            yield waitForTransition;
            this.state = 4;
            contentEl.style.removeProperty("max-height");
          }));
        });
      } else {
        this.state = 4;
      }
    };
    this.collapseAccordion = (initialUpdate = false) => {
      const { contentEl } = this;
      if (initialUpdate || contentEl === void 0) {
        this.state = 1;
        return;
      }
      if (this.state === 1) {
        return;
      }
      if (this.currentRaf !== void 0) {
        cancelAnimationFrame(this.currentRaf);
      }
      if (this.shouldAnimate()) {
        this.currentRaf = raf(() => __async(this, null, function* () {
          const contentHeight = contentEl.offsetHeight;
          contentEl.style.setProperty("max-height", `${contentHeight}px`);
          raf(() => __async(this, null, function* () {
            const waitForTransition = transitionEndAsync(contentEl, 2e3);
            this.state = 2;
            yield waitForTransition;
            this.state = 1;
            contentEl.style.removeProperty("max-height");
          }));
        }));
      } else {
        this.state = 1;
      }
    };
    this.shouldAnimate = () => {
      if (typeof window === "undefined") {
        return false;
      }
      const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        return false;
      }
      const animated = config.get("animated", true);
      if (!animated) {
        return false;
      }
      if (this.accordionGroupEl && !this.accordionGroupEl.animated) {
        return false;
      }
      return true;
    };
    this.updateState = (initialUpdate = false) => __async(this, null, function* () {
      const accordionGroup = this.accordionGroupEl;
      const accordionValue = this.value;
      if (!accordionGroup) {
        return;
      }
      const value = accordionGroup.value;
      const shouldExpand = Array.isArray(value) ? value.includes(accordionValue) : value === accordionValue;
      if (shouldExpand) {
        this.expandAccordion(initialUpdate);
        this.isNext = this.isPrevious = false;
      } else {
        this.collapseAccordion(initialUpdate);
        const nextAccordion = this.getNextSibling();
        const nextAccordionValue = nextAccordion === null || nextAccordion === void 0 ? void 0 : nextAccordion.value;
        if (nextAccordionValue !== void 0) {
          this.isPrevious = Array.isArray(value) ? value.includes(nextAccordionValue) : value === nextAccordionValue;
        }
        const previousAccordion = this.getPreviousSibling();
        const previousAccordionValue = previousAccordion === null || previousAccordion === void 0 ? void 0 : previousAccordion.value;
        if (previousAccordionValue !== void 0) {
          this.isNext = Array.isArray(value) ? value.includes(previousAccordionValue) : value === previousAccordionValue;
        }
      }
    });
    this.getNextSibling = () => {
      if (!this.el) {
        return;
      }
      const nextSibling = this.el.nextElementSibling;
      if ((nextSibling === null || nextSibling === void 0 ? void 0 : nextSibling.tagName) !== "ION-ACCORDION") {
        return;
      }
      return nextSibling;
    };
    this.getPreviousSibling = () => {
      if (!this.el) {
        return;
      }
      const previousSibling = this.el.previousElementSibling;
      if ((previousSibling === null || previousSibling === void 0 ? void 0 : previousSibling.tagName) !== "ION-ACCORDION") {
        return;
      }
      return previousSibling;
    };
  }
  valueChanged() {
    this.updateState();
  }
  connectedCallback() {
    var _a;
    const accordionGroupEl = this.accordionGroupEl = (_a = this.el) === null || _a === void 0 ? void 0 : _a.closest("ion-accordion-group");
    if (accordionGroupEl) {
      this.updateState(true);
      addEventListener(accordionGroupEl, "ionValueChange", this.updateListener);
    }
  }
  disconnectedCallback() {
    const accordionGroupEl = this.accordionGroupEl;
    if (accordionGroupEl) {
      removeEventListener(accordionGroupEl, "ionValueChange", this.updateListener);
    }
  }
  componentDidLoad() {
    this.setItemDefaults();
    this.slotToggleIcon();
    raf(() => {
      const expanded = this.state === 4 || this.state === 8;
      this.setAria(expanded);
    });
  }
  toggleExpanded() {
    const { accordionGroupEl, disabled, readonly, value, state } = this;
    if (disabled || readonly)
      return;
    if (accordionGroupEl) {
      const expand = state === 1 || state === 2;
      accordionGroupEl.requestAccordionToggle(value, expand);
    }
  }
  render() {
    const { disabled, readonly } = this;
    const mode = getIonMode(this);
    const expanded = this.state === 4 || this.state === 8;
    const headerPart = expanded ? "header expanded" : "header";
    const contentPart = expanded ? "content expanded" : "content";
    this.setAria(expanded);
    return h(Host, { key: "073e1d02c18dcbc20c68648426e87c14750c031d", class: {
      [mode]: true,
      "accordion-expanding": this.state === 8,
      "accordion-expanded": this.state === 4,
      "accordion-collapsing": this.state === 2,
      "accordion-collapsed": this.state === 1,
      "accordion-next": this.isNext,
      "accordion-previous": this.isPrevious,
      "accordion-disabled": disabled,
      "accordion-readonly": readonly,
      "accordion-animated": this.shouldAnimate()
    } }, h("div", { key: "9b4cf326de8bb6b4033992903c0c1bfd7eea9bcc", onClick: () => this.toggleExpanded(), id: "header", part: headerPart, "aria-controls": "content", ref: (headerEl) => this.headerEl = headerEl }, h("slot", { key: "464c32a37f64655eacf4218284214f5f30b14a1e", name: "header" })), h("div", { key: "8bb52e6a62d7de0106b253201a89a32e79d9a594", id: "content", part: contentPart, role: "region", "aria-labelledby": "header", ref: (contentEl) => this.contentEl = contentEl }, h("div", { key: "1d9dfd952ad493754aaeea7a8f625b33c2dd90a0", id: "content-wrapper", ref: (contentElWrapper) => this.contentElWrapper = contentElWrapper }, h("slot", { key: "970dfbc55a612d739d0ca3b7b1a08e5c96d0c479", name: "content" }))));
  }
  static get delegatesFocus() {
    return true;
  }
  get el() {
    return getElement(this);
  }
  static get watchers() {
    return {
      "value": ["valueChanged"]
    };
  }
};
var accordionIds = 0;
Accordion.style = {
  ios: accordionIosCss,
  md: accordionMdCss
};
var accordionGroupIosCss = ":host{display:block}:host(.accordion-group-expand-inset){-webkit-margin-start:16px;margin-inline-start:16px;-webkit-margin-end:16px;margin-inline-end:16px;margin-top:16px;margin-bottom:16px}:host(.accordion-group-expand-inset) ::slotted(ion-accordion.accordion-expanding),:host(.accordion-group-expand-inset) ::slotted(ion-accordion.accordion-expanded){border-bottom:none}";
var accordionGroupMdCss = ":host{display:block}:host(.accordion-group-expand-inset){-webkit-margin-start:16px;margin-inline-start:16px;-webkit-margin-end:16px;margin-inline-end:16px;margin-top:16px;margin-bottom:16px}:host(.accordion-group-expand-inset) ::slotted(ion-accordion){-webkit-box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)}:host(.accordion-group-expand-inset) ::slotted(ion-accordion.accordion-expanding),:host(.accordion-group-expand-inset) ::slotted(ion-accordion.accordion-expanded){margin-left:0;margin-right:0;margin-top:16px;margin-bottom:16px;border-radius:6px}:host(.accordion-group-expand-inset) ::slotted(ion-accordion.accordion-previous){border-end-end-radius:6px;border-end-start-radius:6px}:host(.accordion-group-expand-inset) ::slotted(ion-accordion.accordion-next){border-start-start-radius:6px;border-start-end-radius:6px}:host(.accordion-group-expand-inset) ::slotted(ion-accordion):first-of-type{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}";
var AccordionGroup = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.ionChange = createEvent(this, "ionChange", 7);
    this.ionValueChange = createEvent(this, "ionValueChange", 7);
    this.animated = true;
    this.disabled = false;
    this.readonly = false;
    this.expand = "compact";
  }
  valueChanged() {
    const { value, multiple } = this;
    if (!multiple && Array.isArray(value)) {
      printIonWarning(`[ion-accordion-group] - An array of values was passed, but multiple is "false". This is incorrect usage and may result in unexpected behaviors. To dismiss this warning, pass a string to the "value" property when multiple="false".

  Value Passed: [${value.map((v) => `'${v}'`).join(", ")}]
`, this.el);
    }
    this.ionValueChange.emit({ value: this.value });
  }
  disabledChanged() {
    return __async(this, null, function* () {
      const { disabled } = this;
      const accordions = yield this.getAccordions();
      for (const accordion of accordions) {
        accordion.disabled = disabled;
      }
    });
  }
  readonlyChanged() {
    return __async(this, null, function* () {
      const { readonly } = this;
      const accordions = yield this.getAccordions();
      for (const accordion of accordions) {
        accordion.readonly = readonly;
      }
    });
  }
  onKeydown(ev) {
    return __async(this, null, function* () {
      const activeElement = document.activeElement;
      if (!activeElement) {
        return;
      }
      const activeAccordionHeader = activeElement.closest('ion-accordion [slot="header"]');
      if (!activeAccordionHeader) {
        return;
      }
      const accordionEl = activeElement.tagName === "ION-ACCORDION" ? activeElement : activeElement.closest("ion-accordion");
      if (!accordionEl) {
        return;
      }
      const closestGroup = accordionEl.closest("ion-accordion-group");
      if (closestGroup !== this.el) {
        return;
      }
      const accordions = yield this.getAccordions();
      const startingIndex = accordions.findIndex((a) => a === accordionEl);
      if (startingIndex === -1) {
        return;
      }
      let accordion;
      if (ev.key === "ArrowDown") {
        accordion = this.findNextAccordion(accordions, startingIndex);
      } else if (ev.key === "ArrowUp") {
        accordion = this.findPreviousAccordion(accordions, startingIndex);
      } else if (ev.key === "Home") {
        accordion = accordions[0];
      } else if (ev.key === "End") {
        accordion = accordions[accordions.length - 1];
      }
      if (accordion !== void 0 && accordion !== activeElement) {
        accordion.focus();
      }
    });
  }
  componentDidLoad() {
    return __async(this, null, function* () {
      if (this.disabled) {
        this.disabledChanged();
      }
      if (this.readonly) {
        this.readonlyChanged();
      }
      this.valueChanged();
    });
  }
  /**
   * Sets the value property and emits ionChange.
   * This should only be called when the user interacts
   * with the accordion and not for any update
   * to the value property. The exception is when
   * the app sets the value of a single-select
   * accordion group to an array.
   */
  setValue(accordionValue) {
    const value = this.value = accordionValue;
    this.ionChange.emit({ value });
  }
  /**
   * This method is used to ensure that the value
   * of ion-accordion-group is being set in a valid
   * way. This method should only be called in
   * response to a user generated action.
   * @internal
   */
  requestAccordionToggle(accordionValue, accordionExpand) {
    return __async(this, null, function* () {
      const { multiple, value, readonly, disabled } = this;
      if (readonly || disabled) {
        return;
      }
      if (accordionExpand) {
        if (multiple) {
          const groupValue = value !== null && value !== void 0 ? value : [];
          const processedValue = Array.isArray(groupValue) ? groupValue : [groupValue];
          const valueExists = processedValue.find((v) => v === accordionValue);
          if (valueExists === void 0 && accordionValue !== void 0) {
            this.setValue([...processedValue, accordionValue]);
          }
        } else {
          this.setValue(accordionValue);
        }
      } else {
        if (multiple) {
          const groupValue = value !== null && value !== void 0 ? value : [];
          const processedValue = Array.isArray(groupValue) ? groupValue : [groupValue];
          this.setValue(processedValue.filter((v) => v !== accordionValue));
        } else {
          this.setValue(void 0);
        }
      }
    });
  }
  findNextAccordion(accordions, startingIndex) {
    const nextAccordion = accordions[startingIndex + 1];
    if (nextAccordion === void 0) {
      return accordions[0];
    }
    return nextAccordion;
  }
  findPreviousAccordion(accordions, startingIndex) {
    const prevAccordion = accordions[startingIndex - 1];
    if (prevAccordion === void 0) {
      return accordions[accordions.length - 1];
    }
    return prevAccordion;
  }
  /**
   * @internal
   */
  getAccordions() {
    return __async(this, null, function* () {
      return Array.from(this.el.querySelectorAll(":scope > ion-accordion"));
    });
  }
  render() {
    const { disabled, readonly, expand } = this;
    const mode = getIonMode(this);
    return h(Host, { key: "d1a79a93179474fbba66fcf11a92f4871dacc975", class: {
      [mode]: true,
      "accordion-group-disabled": disabled,
      "accordion-group-readonly": readonly,
      [`accordion-group-expand-${expand}`]: true
    }, role: "presentation" }, h("slot", { key: "e6b8954b686d1fbb4fc92adb07fddc97a24b0a31" }));
  }
  get el() {
    return getElement(this);
  }
  static get watchers() {
    return {
      "value": ["valueChanged"],
      "disabled": ["disabledChanged"],
      "readonly": ["readonlyChanged"]
    };
  }
};
AccordionGroup.style = {
  ios: accordionGroupIosCss,
  md: accordionGroupMdCss
};
export {
  Accordion as ion_accordion,
  AccordionGroup as ion_accordion_group
};
/*! Bundled license information:

@ionic/core/dist/esm/ion-accordion_2.entry.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
//# sourceMappingURL=ion-accordion_2.entry-XCB6CFAF.js.map
