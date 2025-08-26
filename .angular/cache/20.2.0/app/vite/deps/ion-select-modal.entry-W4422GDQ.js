import {
  safeCall
} from "./chunk-5VXP7OLQ.js";
import "./chunk-5Q6OMCWS.js";
import {
  getClassMap
} from "./chunk-7ADYHXQV.js";
import {
  getIonMode
} from "./chunk-GY2AZYBV.js";
import "./chunk-QA2SYHF5.js";
import "./chunk-OQQXWWMH.js";
import "./chunk-4EKUW6KP.js";
import "./chunk-LCMILTBF.js";
import {
  Host,
  forceUpdate,
  getElement,
  h,
  registerInstance
} from "./chunk-EUKJBSCI.js";
import "./chunk-UL2P3LPA.js";

// node_modules/@ionic/core/dist/esm/ion-select-modal.entry.js
var ionicSelectModalMdCss = '.sc-ion-select-modal-ionic-h{height:100%}ion-list.sc-ion-select-modal-ionic ion-radio.sc-ion-select-modal-ionic::part(container),ion-list.sc-ion-select-modal-ionic ion-radio.sc-ion-select-modal-ionic [part~="container"]{display:none}ion-list.sc-ion-select-modal-ionic ion-radio.sc-ion-select-modal-ionic::part(label),ion-list.sc-ion-select-modal-ionic ion-radio.sc-ion-select-modal-ionic [part~="label"]{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-item.sc-ion-select-modal-ionic{--inner-border-width:0}.item-radio-checked.sc-ion-select-modal-ionic{--background:rgba(var(--ion-color-primary-rgb, 0, 84, 233), 0.08);--background-focused:var(--ion-color-primary, #0054e9);--background-focused-opacity:0.2;--background-hover:var(--ion-color-primary, #0054e9);--background-hover-opacity:0.12}.item-checkbox-checked.sc-ion-select-modal-ionic{--background-activated:var(--ion-item-color, var(--ion-text-color, #000));--background-focused:var(--ion-item-color, var(--ion-text-color, #000));--background-hover:var(--ion-item-color, var(--ion-text-color, #000));--color:var(--ion-color-primary, #0054e9)}';
var selectModalIosCss = '.sc-ion-select-modal-ios-h{height:100%}ion-item.sc-ion-select-modal-ios{--inner-padding-end:0}ion-radio.sc-ion-select-modal-ios::after{bottom:0;position:absolute;width:calc(100% - 0.9375rem - 16px);border-width:0px 0px 0.55px 0px;border-style:solid;border-color:var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-250, var(--ion-background-color-step-250, #c8c7cc))));content:""}ion-radio.sc-ion-select-modal-ios::after{inset-inline-start:calc(0.9375rem + 16px)}';
var selectModalMdCss = '.sc-ion-select-modal-md-h{height:100%}ion-list.sc-ion-select-modal-md ion-radio.sc-ion-select-modal-md::part(container),ion-list.sc-ion-select-modal-md ion-radio.sc-ion-select-modal-md [part~="container"]{display:none}ion-list.sc-ion-select-modal-md ion-radio.sc-ion-select-modal-md::part(label),ion-list.sc-ion-select-modal-md ion-radio.sc-ion-select-modal-md [part~="label"]{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-item.sc-ion-select-modal-md{--inner-border-width:0}.item-radio-checked.sc-ion-select-modal-md{--background:rgba(var(--ion-color-primary-rgb, 0, 84, 233), 0.08);--background-focused:var(--ion-color-primary, #0054e9);--background-focused-opacity:0.2;--background-hover:var(--ion-color-primary, #0054e9);--background-hover-opacity:0.12}.item-checkbox-checked.sc-ion-select-modal-md{--background-activated:var(--ion-item-color, var(--ion-text-color, #000));--background-focused:var(--ion-item-color, var(--ion-text-color, #000));--background-hover:var(--ion-item-color, var(--ion-text-color, #000));--color:var(--ion-color-primary, #0054e9)}';
var SelectModal = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.options = [];
  }
  closeModal() {
    const modal = this.el.closest("ion-modal");
    if (modal) {
      modal.dismiss();
    }
  }
  findOptionFromEvent(ev) {
    const { options } = this;
    return options.find((o) => o.value === ev.target.value);
  }
  getValues(ev) {
    const { multiple, options } = this;
    if (multiple) {
      return options.filter((o) => o.checked).map((o) => o.value);
    }
    const option = ev ? this.findOptionFromEvent(ev) : null;
    return option ? option.value : void 0;
  }
  callOptionHandler(ev) {
    const option = this.findOptionFromEvent(ev);
    const values = this.getValues(ev);
    if (option === null || option === void 0 ? void 0 : option.handler) {
      safeCall(option.handler, values);
    }
  }
  setChecked(ev) {
    const { multiple } = this;
    const option = this.findOptionFromEvent(ev);
    if (multiple && option) {
      option.checked = ev.detail.checked;
    }
  }
  renderRadioOptions() {
    const checked = this.options.filter((o) => o.checked).map((o) => o.value)[0];
    return h("ion-radio-group", { value: checked, onIonChange: (ev) => this.callOptionHandler(ev) }, this.options.map((option) => h("ion-item", { lines: "none", class: Object.assign({
      // TODO FW-4784
      "item-radio-checked": option.value === checked
    }, getClassMap(option.cssClass)) }, h("ion-radio", { value: option.value, disabled: option.disabled, justify: "start", labelPlacement: "end", onClick: () => this.closeModal(), onKeyUp: (ev) => {
      if (ev.key === " ") {
        this.closeModal();
      }
    } }, option.text))));
  }
  renderCheckboxOptions() {
    return this.options.map((option) => h("ion-item", { class: Object.assign({
      // TODO FW-4784
      "item-checkbox-checked": option.checked
    }, getClassMap(option.cssClass)) }, h("ion-checkbox", { value: option.value, disabled: option.disabled, checked: option.checked, justify: "start", labelPlacement: "end", onIonChange: (ev) => {
      this.setChecked(ev);
      this.callOptionHandler(ev);
      forceUpdate(this);
    } }, option.text)));
  }
  render() {
    return h(Host, { key: "b6c0dec240b2e41985b15fdf4e5a6d3a145c1567", class: getIonMode(this) }, h("ion-header", { key: "cd177e85ee0f62a60a3a708342d6ab6eb19a44dc" }, h("ion-toolbar", { key: "aee8222a5a4daa540ad202b2e4cac1ef93d9558c" }, this.header !== void 0 && h("ion-title", { key: "5f8fecc764d97bf840d3d4cfddeeccd118ab4436" }, this.header), h("ion-buttons", { key: "919033950d7c2b0101f96a9c9698219de9f568ea", slot: "end" }, h("ion-button", { key: "34b571cab6dced4bde555a077a21e91800829931", onClick: () => this.closeModal() }, "Close")))), h("ion-content", { key: "3c9153d26ba7a5a03d3b20fcd628d0c3031661a7" }, h("ion-list", { key: "e00b222c071bc97c82ad1bba4db95a8a5c43ed6d" }, this.multiple === true ? this.renderCheckboxOptions() : this.renderRadioOptions())));
  }
  get el() {
    return getElement(this);
  }
};
SelectModal.style = {
  ionic: ionicSelectModalMdCss,
  ios: selectModalIosCss,
  md: selectModalMdCss
};
export {
  SelectModal as ion_select_modal
};
/*! Bundled license information:

@ionic/core/dist/esm/ion-select-modal.entry.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
//# sourceMappingURL=ion-select-modal.entry-W4422GDQ.js.map
