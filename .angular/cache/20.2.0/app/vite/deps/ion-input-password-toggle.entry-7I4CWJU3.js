import {
  eye,
  eyeOff
} from "./chunk-IUTD4BIB.js";
import {
  createColorClasses
} from "./chunk-7ADYHXQV.js";
import {
  getIonMode
} from "./chunk-GY2AZYBV.js";
import {
  Host,
  getElement,
  h,
  printIonWarning,
  registerInstance
} from "./chunk-EUKJBSCI.js";
import "./chunk-UL2P3LPA.js";

// node_modules/@ionic/core/dist/esm/ion-input-password-toggle.entry.js
var iosInputPasswordToggleCss = "";
var mdInputPasswordToggleCss = "";
var InputPasswordToggle = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.type = "password";
    this.togglePasswordVisibility = () => {
      const { inputElRef } = this;
      if (!inputElRef) {
        return;
      }
      inputElRef.type = inputElRef.type === "text" ? "password" : "text";
    };
  }
  /**
   * Whenever the input type changes we need to re-run validation to ensure the password
   * toggle is being used with the correct input type. If the application changes the type
   * outside of this component we also need to re-render so the correct icon is shown.
   */
  onTypeChange(newValue) {
    if (newValue !== "text" && newValue !== "password") {
      printIonWarning(`[ion-input-password-toggle] - Only inputs of type "text" or "password" are supported. Input of type "${newValue}" is not compatible.`, this.el);
      return;
    }
  }
  connectedCallback() {
    const { el } = this;
    const inputElRef = this.inputElRef = el.closest("ion-input");
    if (!inputElRef) {
      printIonWarning("[ion-input-password-toggle] - No ancestor ion-input found. This component must be slotted inside of an ion-input.", el);
      return;
    }
    this.type = inputElRef.type;
  }
  disconnectedCallback() {
    this.inputElRef = null;
  }
  render() {
    var _a, _b;
    const { color, type } = this;
    const mode = getIonMode(this);
    const showPasswordIcon = (_a = this.showIcon) !== null && _a !== void 0 ? _a : eye;
    const hidePasswordIcon = (_b = this.hideIcon) !== null && _b !== void 0 ? _b : eyeOff;
    const isPasswordVisible = type === "text";
    return h(Host, { key: "91bc55664d496fe457518bd112865dd7811d0c17", class: createColorClasses(color, {
      [mode]: true
    }) }, h("ion-button", { key: "f3e436422110c9cb4d5c0b83500255b24ab4cdef", mode, color, fill: "clear", shape: "round", "aria-checked": isPasswordVisible ? "true" : "false", "aria-label": isPasswordVisible ? "Hide password" : "Show password", role: "switch", type: "button", onPointerDown: (ev) => {
      ev.preventDefault();
    }, onClick: this.togglePasswordVisibility }, h("ion-icon", { key: "5c8b121153f148f92aa7cba0447673a4f6f3ad1e", slot: "icon-only", "aria-hidden": "true", icon: isPasswordVisible ? hidePasswordIcon : showPasswordIcon })));
  }
  get el() {
    return getElement(this);
  }
  static get watchers() {
    return {
      "type": ["onTypeChange"]
    };
  }
};
InputPasswordToggle.style = {
  ios: iosInputPasswordToggleCss,
  md: mdInputPasswordToggleCss
};
export {
  InputPasswordToggle as ion_input_password_toggle
};
/*! Bundled license information:

@ionic/core/dist/esm/ion-input-password-toggle.entry.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
//# sourceMappingURL=ion-input-password-toggle.entry-7I4CWJU3.js.map
