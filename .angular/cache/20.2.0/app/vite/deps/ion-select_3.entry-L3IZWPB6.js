import {
  compareOptions,
  isOptionSelected
} from "./chunk-4YTI4ER5.js";
import {
  createNotchController
} from "./chunk-3WIHJ436.js";
import {
  watchForOptions
} from "./chunk-BW7P24PA.js";
import {
  isRTL
} from "./chunk-5NKZUR6M.js";
import {
  caretDownSharp,
  chevronExpand
} from "./chunk-IUTD4BIB.js";
import {
  actionSheetController,
  alertController,
  modalController,
  popoverController,
  safeCall
} from "./chunk-5VXP7OLQ.js";
import "./chunk-5Q6OMCWS.js";
import {
  createColorClasses,
  getClassMap,
  hostContext
} from "./chunk-7ADYHXQV.js";
import {
  getIonMode
} from "./chunk-GY2AZYBV.js";
import "./chunk-QA2SYHF5.js";
import "./chunk-OQQXWWMH.js";
import {
  focusVisibleElement,
  inheritAttributes,
  renderHiddenInput
} from "./chunk-4EKUW6KP.js";
import "./chunk-LCMILTBF.js";
import {
  Host,
  createEvent,
  forceUpdate,
  getElement,
  h,
  printIonWarning,
  registerInstance
} from "./chunk-EUKJBSCI.js";
import {
  __async
} from "./chunk-UL2P3LPA.js";

// node_modules/@ionic/core/dist/esm/ion-select_3.entry.js
var selectIosCss = ":host{--padding-top:0px;--padding-end:0px;--padding-bottom:0px;--padding-start:0px;--placeholder-color:currentColor;--placeholder-opacity:var(--ion-placeholder-opacity, 0.6);--background:transparent;--border-style:solid;--highlight-color-focused:var(--ion-color-primary, #0054e9);--highlight-color-valid:var(--ion-color-success, #2dd55b);--highlight-color-invalid:var(--ion-color-danger, #c5000f);--highlight-color:var(--highlight-color-focused);display:block;position:relative;width:100%;min-height:44px;font-family:var(--ion-font-family, inherit);white-space:nowrap;cursor:pointer;z-index:2}:host(.select-label-placement-floating),:host(.select-label-placement-stacked){min-height:56px}:host(.ion-color){--highlight-color-focused:var(--ion-color-base)}:host(.in-item){-ms-flex:1 1 0px;flex:1 1 0}:host(.select-disabled){pointer-events:none}:host(.has-focus) button{border:2px solid #5e9ed6}:host([slot=start]),:host([slot=end]){-ms-flex:initial;flex:initial;width:auto}.select-placeholder{color:var(--placeholder-color);opacity:var(--placeholder-opacity)}button{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;margin:0;padding:0;border:0;outline:0;clip:rect(0 0 0 0);opacity:0;overflow:hidden;-webkit-appearance:none;-moz-appearance:none}.select-icon{-webkit-margin-start:4px;margin-inline-start:4px;-webkit-margin-end:0;margin-inline-end:0;margin-top:0;margin-bottom:0;position:relative;-ms-flex-negative:0;flex-shrink:0}:host(.in-item-color) .select-icon{color:inherit}:host(.select-label-placement-stacked) .select-icon,:host(.select-label-placement-floating) .select-icon{position:absolute;height:100%}:host(.select-ltr.select-label-placement-stacked) .select-icon,:host(.select-ltr.select-label-placement-floating) .select-icon{right:var(--padding-end, 0)}:host(.select-rtl.select-label-placement-stacked) .select-icon,:host(.select-rtl.select-label-placement-floating) .select-icon{left:var(--padding-start, 0)}.select-text{-ms-flex:1;flex:1;min-width:16px;font-size:inherit;text-overflow:ellipsis;white-space:inherit;overflow:hidden}.select-wrapper{-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);border-radius:var(--border-radius);display:-ms-flexbox;display:flex;position:relative;-ms-flex-positive:1;flex-grow:1;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;height:inherit;min-height:inherit;-webkit-transition:background-color 15ms linear;transition:background-color 15ms linear;background:var(--background);line-height:normal;cursor:inherit;-webkit-box-sizing:border-box;box-sizing:border-box}.select-wrapper .select-placeholder{-webkit-transition:opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);transition:opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)}.select-wrapper-inner{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;overflow:hidden}:host(.select-label-placement-stacked) .select-wrapper-inner,:host(.select-label-placement-floating) .select-wrapper-inner{-ms-flex-positive:1;flex-grow:1}:host(.ion-touched.ion-invalid){--highlight-color:var(--highlight-color-invalid)}:host(.ion-valid){--highlight-color:var(--highlight-color-valid)}.select-bottom{-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end);padding-top:5px;padding-bottom:0;display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;border-top:var(--border-width) var(--border-style) var(--border-color);font-size:0.75rem;white-space:normal}:host(.has-focus.ion-valid),:host(.select-expanded.ion-valid),:host(.ion-touched.ion-invalid),:host(.select-expanded.ion-touched.ion-invalid){--border-color:var(--highlight-color)}.select-bottom .error-text{display:none;color:var(--highlight-color-invalid)}.select-bottom .helper-text{display:block;color:var(--ion-color-step-700, var(--ion-text-color-step-300, #4d4d4d))}:host(.ion-touched.ion-invalid) .select-bottom .error-text{display:block}:host(.ion-touched.ion-invalid) .select-bottom .helper-text{display:none}.label-text-wrapper{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;max-width:200px;-webkit-transition:color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);transition:color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);transition:color 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms cubic-bezier(0.4, 0, 0.2, 1);transition:color 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);pointer-events:none}.label-text,::slotted([slot=label]){text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.label-text-wrapper-hidden,.select-outline-notch-hidden{display:none}.native-wrapper{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-webkit-transition:opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);transition:opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);overflow:hidden}:host(.select-justify-space-between) .select-wrapper{-ms-flex-pack:justify;justify-content:space-between}:host(.select-justify-start) .select-wrapper{-ms-flex-pack:start;justify-content:start}:host(.select-justify-end) .select-wrapper{-ms-flex-pack:end;justify-content:end}:host(.select-label-placement-start) .select-wrapper{-ms-flex-direction:row;flex-direction:row}:host(.select-label-placement-start) .label-text-wrapper{-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:16px;margin-inline-end:16px;margin-top:0;margin-bottom:0}:host(.select-label-placement-end) .select-wrapper{-ms-flex-direction:row-reverse;flex-direction:row-reverse}:host(.select-label-placement-end) .label-text-wrapper{-webkit-margin-start:16px;margin-inline-start:16px;-webkit-margin-end:0;margin-inline-end:0;margin-top:0;margin-bottom:0}:host(.select-label-placement-fixed) .label-text-wrapper{-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:16px;margin-inline-end:16px;margin-top:0;margin-bottom:0}:host(.select-label-placement-fixed) .label-text-wrapper{-ms-flex:0 0 100px;flex:0 0 100px;width:100px;min-width:100px;max-width:200px}:host(.select-label-placement-stacked) .select-wrapper,:host(.select-label-placement-floating) .select-wrapper{-ms-flex-direction:column;flex-direction:column;-ms-flex-align:start;align-items:start}:host(.select-label-placement-stacked) .label-text-wrapper,:host(.select-label-placement-floating) .label-text-wrapper{max-width:100%}:host(.select-ltr.select-label-placement-stacked) .label-text-wrapper,:host(.select-ltr.select-label-placement-floating) .label-text-wrapper{-webkit-transform-origin:left top;transform-origin:left top}:host(.select-rtl.select-label-placement-stacked) .label-text-wrapper,:host(.select-rtl.select-label-placement-floating) .label-text-wrapper{-webkit-transform-origin:right top;transform-origin:right top}:host(.select-label-placement-stacked) .native-wrapper,:host(.select-label-placement-floating) .native-wrapper{margin-left:0;margin-right:0;margin-top:1px;margin-bottom:0;-ms-flex-positive:1;flex-grow:1;width:100%}:host(.select-label-placement-floating) .label-text-wrapper{-webkit-transform:translateY(100%) scale(1);transform:translateY(100%) scale(1)}:host(.select-label-placement-floating:not(.label-floating)) .native-wrapper .select-placeholder{opacity:0}:host(.select-expanded.select-label-placement-floating) .native-wrapper .select-placeholder,:host(.has-focus.select-label-placement-floating) .native-wrapper .select-placeholder,:host(.has-value.select-label-placement-floating) .native-wrapper .select-placeholder{opacity:1}:host(.label-floating) .label-text-wrapper{-webkit-transform:translateY(50%) scale(0.75);transform:translateY(50%) scale(0.75);max-width:calc(100% / 0.75)}::slotted([slot=start]),::slotted([slot=end]){-ms-flex-negative:0;flex-shrink:0}::slotted([slot=start]:last-of-type){-webkit-margin-end:16px;margin-inline-end:16px;-webkit-margin-start:0;margin-inline-start:0}::slotted([slot=end]:first-of-type){-webkit-margin-start:16px;margin-inline-start:16px;-webkit-margin-end:0;margin-inline-end:0}:host{--border-width:0.55px;--border-color:var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-250, var(--ion-background-color-step-250, #c8c7cc))));--highlight-height:0px}.select-icon{width:1.125rem;height:1.125rem;color:var(--ion-color-step-650, var(--ion-text-color-step-350, #595959))}:host(.select-label-placement-stacked) .select-wrapper-inner,:host(.select-label-placement-floating) .select-wrapper-inner{width:calc(100% - 1.125rem - 4px)}:host(.select-disabled){opacity:0.3}::slotted(ion-button[slot=start].button-has-icon-only),::slotted(ion-button[slot=end].button-has-icon-only){--border-radius:50%;--padding-start:0;--padding-end:0;--padding-top:0;--padding-bottom:0;aspect-ratio:1}";
var selectMdCss = ":host{--padding-top:0px;--padding-end:0px;--padding-bottom:0px;--padding-start:0px;--placeholder-color:currentColor;--placeholder-opacity:var(--ion-placeholder-opacity, 0.6);--background:transparent;--border-style:solid;--highlight-color-focused:var(--ion-color-primary, #0054e9);--highlight-color-valid:var(--ion-color-success, #2dd55b);--highlight-color-invalid:var(--ion-color-danger, #c5000f);--highlight-color:var(--highlight-color-focused);display:block;position:relative;width:100%;min-height:44px;font-family:var(--ion-font-family, inherit);white-space:nowrap;cursor:pointer;z-index:2}:host(.select-label-placement-floating),:host(.select-label-placement-stacked){min-height:56px}:host(.ion-color){--highlight-color-focused:var(--ion-color-base)}:host(.in-item){-ms-flex:1 1 0px;flex:1 1 0}:host(.select-disabled){pointer-events:none}:host(.has-focus) button{border:2px solid #5e9ed6}:host([slot=start]),:host([slot=end]){-ms-flex:initial;flex:initial;width:auto}.select-placeholder{color:var(--placeholder-color);opacity:var(--placeholder-opacity)}button{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;margin:0;padding:0;border:0;outline:0;clip:rect(0 0 0 0);opacity:0;overflow:hidden;-webkit-appearance:none;-moz-appearance:none}.select-icon{-webkit-margin-start:4px;margin-inline-start:4px;-webkit-margin-end:0;margin-inline-end:0;margin-top:0;margin-bottom:0;position:relative;-ms-flex-negative:0;flex-shrink:0}:host(.in-item-color) .select-icon{color:inherit}:host(.select-label-placement-stacked) .select-icon,:host(.select-label-placement-floating) .select-icon{position:absolute;height:100%}:host(.select-ltr.select-label-placement-stacked) .select-icon,:host(.select-ltr.select-label-placement-floating) .select-icon{right:var(--padding-end, 0)}:host(.select-rtl.select-label-placement-stacked) .select-icon,:host(.select-rtl.select-label-placement-floating) .select-icon{left:var(--padding-start, 0)}.select-text{-ms-flex:1;flex:1;min-width:16px;font-size:inherit;text-overflow:ellipsis;white-space:inherit;overflow:hidden}.select-wrapper{-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);border-radius:var(--border-radius);display:-ms-flexbox;display:flex;position:relative;-ms-flex-positive:1;flex-grow:1;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;height:inherit;min-height:inherit;-webkit-transition:background-color 15ms linear;transition:background-color 15ms linear;background:var(--background);line-height:normal;cursor:inherit;-webkit-box-sizing:border-box;box-sizing:border-box}.select-wrapper .select-placeholder{-webkit-transition:opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);transition:opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)}.select-wrapper-inner{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;overflow:hidden}:host(.select-label-placement-stacked) .select-wrapper-inner,:host(.select-label-placement-floating) .select-wrapper-inner{-ms-flex-positive:1;flex-grow:1}:host(.ion-touched.ion-invalid){--highlight-color:var(--highlight-color-invalid)}:host(.ion-valid){--highlight-color:var(--highlight-color-valid)}.select-bottom{-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end);padding-top:5px;padding-bottom:0;display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;border-top:var(--border-width) var(--border-style) var(--border-color);font-size:0.75rem;white-space:normal}:host(.has-focus.ion-valid),:host(.select-expanded.ion-valid),:host(.ion-touched.ion-invalid),:host(.select-expanded.ion-touched.ion-invalid){--border-color:var(--highlight-color)}.select-bottom .error-text{display:none;color:var(--highlight-color-invalid)}.select-bottom .helper-text{display:block;color:var(--ion-color-step-700, var(--ion-text-color-step-300, #4d4d4d))}:host(.ion-touched.ion-invalid) .select-bottom .error-text{display:block}:host(.ion-touched.ion-invalid) .select-bottom .helper-text{display:none}.label-text-wrapper{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;max-width:200px;-webkit-transition:color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);transition:color 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);transition:color 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms cubic-bezier(0.4, 0, 0.2, 1);transition:color 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 150ms cubic-bezier(0.4, 0, 0.2, 1);pointer-events:none}.label-text,::slotted([slot=label]){text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.label-text-wrapper-hidden,.select-outline-notch-hidden{display:none}.native-wrapper{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-webkit-transition:opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);transition:opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);overflow:hidden}:host(.select-justify-space-between) .select-wrapper{-ms-flex-pack:justify;justify-content:space-between}:host(.select-justify-start) .select-wrapper{-ms-flex-pack:start;justify-content:start}:host(.select-justify-end) .select-wrapper{-ms-flex-pack:end;justify-content:end}:host(.select-label-placement-start) .select-wrapper{-ms-flex-direction:row;flex-direction:row}:host(.select-label-placement-start) .label-text-wrapper{-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:16px;margin-inline-end:16px;margin-top:0;margin-bottom:0}:host(.select-label-placement-end) .select-wrapper{-ms-flex-direction:row-reverse;flex-direction:row-reverse}:host(.select-label-placement-end) .label-text-wrapper{-webkit-margin-start:16px;margin-inline-start:16px;-webkit-margin-end:0;margin-inline-end:0;margin-top:0;margin-bottom:0}:host(.select-label-placement-fixed) .label-text-wrapper{-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:16px;margin-inline-end:16px;margin-top:0;margin-bottom:0}:host(.select-label-placement-fixed) .label-text-wrapper{-ms-flex:0 0 100px;flex:0 0 100px;width:100px;min-width:100px;max-width:200px}:host(.select-label-placement-stacked) .select-wrapper,:host(.select-label-placement-floating) .select-wrapper{-ms-flex-direction:column;flex-direction:column;-ms-flex-align:start;align-items:start}:host(.select-label-placement-stacked) .label-text-wrapper,:host(.select-label-placement-floating) .label-text-wrapper{max-width:100%}:host(.select-ltr.select-label-placement-stacked) .label-text-wrapper,:host(.select-ltr.select-label-placement-floating) .label-text-wrapper{-webkit-transform-origin:left top;transform-origin:left top}:host(.select-rtl.select-label-placement-stacked) .label-text-wrapper,:host(.select-rtl.select-label-placement-floating) .label-text-wrapper{-webkit-transform-origin:right top;transform-origin:right top}:host(.select-label-placement-stacked) .native-wrapper,:host(.select-label-placement-floating) .native-wrapper{margin-left:0;margin-right:0;margin-top:1px;margin-bottom:0;-ms-flex-positive:1;flex-grow:1;width:100%}:host(.select-label-placement-floating) .label-text-wrapper{-webkit-transform:translateY(100%) scale(1);transform:translateY(100%) scale(1)}:host(.select-label-placement-floating:not(.label-floating)) .native-wrapper .select-placeholder{opacity:0}:host(.select-expanded.select-label-placement-floating) .native-wrapper .select-placeholder,:host(.has-focus.select-label-placement-floating) .native-wrapper .select-placeholder,:host(.has-value.select-label-placement-floating) .native-wrapper .select-placeholder{opacity:1}:host(.label-floating) .label-text-wrapper{-webkit-transform:translateY(50%) scale(0.75);transform:translateY(50%) scale(0.75);max-width:calc(100% / 0.75)}::slotted([slot=start]),::slotted([slot=end]){-ms-flex-negative:0;flex-shrink:0}::slotted([slot=start]:last-of-type){-webkit-margin-end:16px;margin-inline-end:16px;-webkit-margin-start:0;margin-inline-start:0}::slotted([slot=end]:first-of-type){-webkit-margin-start:16px;margin-inline-start:16px;-webkit-margin-end:0;margin-inline-end:0}:host(.select-fill-solid){--background:var(--ion-color-step-50, var(--ion-background-color-step-50, #f2f2f2));--border-color:var(--ion-color-step-500, var(--ion-background-color-step-500, gray));--border-radius:4px;--padding-start:16px;--padding-end:16px;min-height:56px}:host(.select-fill-solid) .select-wrapper{border-bottom:var(--border-width) var(--border-style) var(--border-color)}:host(.select-expanded.select-fill-solid.ion-valid),:host(.has-focus.select-fill-solid.ion-valid),:host(.select-fill-solid.ion-touched.ion-invalid){--border-color:var(--highlight-color)}:host(.select-fill-solid) .select-bottom{border-top:none}@media (any-hover: hover){:host(.select-fill-solid:hover){--background:var(--ion-color-step-100, var(--ion-background-color-step-100, #e6e6e6));--border-color:var(--ion-color-step-750, var(--ion-background-color-step-750, #404040))}}:host(.select-fill-solid.select-expanded),:host(.select-fill-solid.has-focus){--background:var(--ion-color-step-150, var(--ion-background-color-step-150, #d9d9d9));--border-color:var(--highlight-color)}:host(.select-fill-solid) .select-wrapper{border-start-start-radius:var(--border-radius);border-start-end-radius:var(--border-radius);border-end-end-radius:0px;border-end-start-radius:0px}:host(.label-floating.select-fill-solid) .label-text-wrapper{max-width:calc(100% / 0.75)}:host(.in-item.select-expanded.select-fill-solid) .select-wrapper .select-icon,:host(.in-item.has-focus.select-fill-solid) .select-wrapper .select-icon,:host(.in-item.has-focus.ion-valid.select-fill-solid) .select-wrapper .select-icon,:host(.in-item.ion-touched.ion-invalid.select-fill-solid) .select-wrapper .select-icon{color:var(--highlight-color)}:host(.select-fill-outline){--border-color:var(--ion-color-step-300, var(--ion-background-color-step-300, #b3b3b3));--border-radius:4px;--padding-start:16px;--padding-end:16px;min-height:56px}:host(.select-fill-outline.select-shape-round){--border-radius:28px;--padding-start:32px;--padding-end:32px}:host(.has-focus.select-fill-outline.ion-valid),:host(.select-fill-outline.ion-touched.ion-invalid){--border-color:var(--highlight-color)}@media (any-hover: hover){:host(.select-fill-outline:hover){--border-color:var(--ion-color-step-750, var(--ion-background-color-step-750, #404040))}}:host(.select-fill-outline.select-expanded),:host(.select-fill-outline.has-focus){--border-width:var(--highlight-height);--border-color:var(--highlight-color)}:host(.select-fill-outline) .select-bottom{border-top:none}:host(.select-fill-outline) .select-wrapper{border-bottom:none}:host(.select-ltr.select-fill-outline.select-label-placement-stacked) .label-text-wrapper,:host(.select-ltr.select-fill-outline.select-label-placement-floating) .label-text-wrapper{-webkit-transform-origin:left top;transform-origin:left top}:host(.select-rtl.select-fill-outline.select-label-placement-stacked) .label-text-wrapper,:host(.select-rtl.select-fill-outline.select-label-placement-floating) .label-text-wrapper{-webkit-transform-origin:right top;transform-origin:right top}:host(.select-fill-outline.select-label-placement-stacked) .label-text-wrapper,:host(.select-fill-outline.select-label-placement-floating) .label-text-wrapper{position:absolute;max-width:calc(100% - var(--padding-start) - var(--padding-end))}:host(.select-fill-outline) .label-text-wrapper{position:relative;z-index:1}:host(.label-floating.select-fill-outline) .label-text-wrapper{-webkit-transform:translateY(-32%) scale(0.75);transform:translateY(-32%) scale(0.75);margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;max-width:calc((100% - var(--padding-start) - var(--padding-end) - 8px) / 0.75)}:host(.select-fill-outline.select-label-placement-stacked) select,:host(.select-fill-outline.select-label-placement-floating) select{margin-left:0;margin-right:0;margin-top:6px;margin-bottom:6px}:host(.select-fill-outline) .select-outline-container{left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;width:100%;height:100%}:host(.select-fill-outline) .select-outline-start,:host(.select-fill-outline) .select-outline-end{pointer-events:none}:host(.select-fill-outline) .select-outline-start,:host(.select-fill-outline) .select-outline-notch,:host(.select-fill-outline) .select-outline-end{border-top:var(--border-width) var(--border-style) var(--border-color);border-bottom:var(--border-width) var(--border-style) var(--border-color);-webkit-box-sizing:border-box;box-sizing:border-box}:host(.select-fill-outline) .select-outline-notch{max-width:calc(100% - var(--padding-start) - var(--padding-end))}:host(.select-fill-outline) .notch-spacer{-webkit-padding-end:8px;padding-inline-end:8px;font-size:calc(1em * 0.75);opacity:0;pointer-events:none}:host(.select-fill-outline) .select-outline-start{-webkit-border-start:var(--border-width) var(--border-style) var(--border-color);border-inline-start:var(--border-width) var(--border-style) var(--border-color)}:host(.select-fill-outline) .select-outline-start{border-start-start-radius:var(--border-radius);border-start-end-radius:0px;border-end-end-radius:0px;border-end-start-radius:var(--border-radius)}:host(.select-fill-outline) .select-outline-start{width:calc(var(--padding-start) - 4px)}:host(.select-fill-outline) .select-outline-end{-webkit-border-end:var(--border-width) var(--border-style) var(--border-color);border-inline-end:var(--border-width) var(--border-style) var(--border-color)}:host(.select-fill-outline) .select-outline-end{border-start-start-radius:0px;border-start-end-radius:var(--border-radius);border-end-end-radius:var(--border-radius);border-end-start-radius:0px}:host(.select-fill-outline) .select-outline-end{-ms-flex-positive:1;flex-grow:1}:host(.label-floating.select-fill-outline) .select-outline-notch{border-top:none}:host(.in-item.select-expanded.select-fill-outline) .select-wrapper .select-icon,:host(.in-item.has-focus.select-fill-outline) .select-wrapper .select-icon,:host(.in-item.has-focus.ion-valid.select-fill-outline) .select-wrapper .select-icon,:host(.in-item.ion-touched.ion-invalid.select-fill-outline) .select-wrapper .select-icon{color:var(--highlight-color)}:host{--border-width:1px;--border-color:var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-150, var(--ion-background-color-step-150, rgba(0, 0, 0, 0.13)))));--highlight-height:2px}:host(.select-label-placement-floating.select-expanded) .label-text-wrapper,:host(.select-label-placement-floating.has-focus) .label-text-wrapper,:host(.select-label-placement-stacked.select-expanded) .label-text-wrapper,:host(.select-label-placement-stacked.has-focus) .label-text-wrapper{color:var(--highlight-color)}:host(.has-focus.select-label-placement-floating.ion-valid) .label-text-wrapper,:host(.select-label-placement-floating.ion-touched.ion-invalid) .label-text-wrapper,:host(.has-focus.select-label-placement-stacked.ion-valid) .label-text-wrapper,:host(.select-label-placement-stacked.ion-touched.ion-invalid) .label-text-wrapper{color:var(--highlight-color)}.select-highlight{bottom:-1px;position:absolute;width:100%;height:var(--highlight-height);-webkit-transform:scale(0);transform:scale(0);-webkit-transition:-webkit-transform 200ms;transition:-webkit-transform 200ms;transition:transform 200ms;transition:transform 200ms, -webkit-transform 200ms;background:var(--highlight-color)}.select-highlight{inset-inline-start:0}:host(.select-expanded) .select-highlight,:host(.has-focus) .select-highlight{-webkit-transform:scale(1);transform:scale(1)}:host(.in-item) .select-highlight{bottom:0}:host(.in-item) .select-highlight{inset-inline-start:0}.select-icon{width:0.8125rem;-webkit-transition:-webkit-transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);transition:-webkit-transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);transition:transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);transition:transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);color:var(--ion-color-step-500, var(--ion-text-color-step-500, gray))}:host(.select-expanded:not(.has-expanded-icon)) .select-icon{-webkit-transform:rotate(180deg);transform:rotate(180deg)}:host(.in-item.select-expanded) .select-wrapper .select-icon,:host(.in-item.has-focus) .select-wrapper .select-icon,:host(.in-item.has-focus.ion-valid) .select-wrapper .select-icon,:host(.in-item.ion-touched.ion-invalid) .select-wrapper .select-icon{color:var(--ion-color-step-500, var(--ion-text-color-step-500, gray))}:host(.select-expanded) .select-wrapper .select-icon,:host(.has-focus.ion-valid) .select-wrapper .select-icon,:host(.ion-touched.ion-invalid) .select-wrapper .select-icon,:host(.has-focus) .select-wrapper .select-icon{color:var(--highlight-color)}:host(.select-shape-round){--border-radius:16px}:host(.select-label-placement-stacked) .select-wrapper-inner,:host(.select-label-placement-floating) .select-wrapper-inner{width:calc(100% - 0.8125rem - 4px)}:host(.select-disabled){opacity:0.38}::slotted(ion-button[slot=start].button-has-icon-only),::slotted(ion-button[slot=end].button-has-icon-only){--border-radius:50%;--padding-start:8px;--padding-end:8px;--padding-top:8px;--padding-bottom:8px;aspect-ratio:1;min-height:40px}";
var Select = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.ionChange = createEvent(this, "ionChange", 7);
    this.ionCancel = createEvent(this, "ionCancel", 7);
    this.ionDismiss = createEvent(this, "ionDismiss", 7);
    this.ionFocus = createEvent(this, "ionFocus", 7);
    this.ionBlur = createEvent(this, "ionBlur", 7);
    this.ionStyle = createEvent(this, "ionStyle", 7);
    this.inputId = `ion-sel-${selectIds++}`;
    this.helperTextId = `${this.inputId}-helper-text`;
    this.errorTextId = `${this.inputId}-error-text`;
    this.inheritedAttributes = {};
    this.isExpanded = false;
    this.hasFocus = false;
    this.cancelText = "Cancel";
    this.disabled = false;
    this.interface = "alert";
    this.interfaceOptions = {};
    this.labelPlacement = "start";
    this.multiple = false;
    this.name = this.inputId;
    this.okText = "OK";
    this.required = false;
    this.onClick = (ev) => {
      const target = ev.target;
      const closestSlot = target.closest('[slot="start"], [slot="end"]');
      if (target === this.el || closestSlot === null) {
        this.setFocus();
        this.open(ev);
      } else {
        ev.preventDefault();
      }
    };
    this.onFocus = () => {
      this.hasFocus = true;
      this.ionFocus.emit();
    };
    this.onBlur = () => {
      this.hasFocus = false;
      this.ionBlur.emit();
    };
    this.onLabelClick = (ev) => {
      if (ev.target === ev.currentTarget) {
        ev.stopPropagation();
      }
    };
  }
  styleChanged() {
    this.emitStyle();
  }
  setValue(value) {
    this.value = value;
    this.ionChange.emit({ value });
  }
  connectedCallback() {
    return __async(this, null, function* () {
      const { el } = this;
      this.notchController = createNotchController(el, () => this.notchSpacerEl, () => this.labelSlot);
      this.updateOverlayOptions();
      this.emitStyle();
      this.mutationO = watchForOptions(this.el, "ion-select-option", () => __async(this, null, function* () {
        this.updateOverlayOptions();
        forceUpdate(this);
      }));
    });
  }
  componentWillLoad() {
    this.inheritedAttributes = inheritAttributes(this.el, ["aria-label"]);
  }
  componentDidLoad() {
    this.emitStyle();
  }
  disconnectedCallback() {
    if (this.mutationO) {
      this.mutationO.disconnect();
      this.mutationO = void 0;
    }
    if (this.notchController) {
      this.notchController.destroy();
      this.notchController = void 0;
    }
  }
  /**
   * Open the select overlay. The overlay is either an alert, action sheet, or popover,
   * depending on the `interface` property on the `ion-select`.
   *
   * @param event The user interface event that called the open.
   */
  open(event) {
    return __async(this, null, function* () {
      if (this.disabled || this.isExpanded) {
        return void 0;
      }
      this.isExpanded = true;
      const overlay = this.overlay = yield this.createOverlay(event);
      const scrollSelectedIntoView = () => {
        const indexOfSelected = this.childOpts.findIndex((o) => o.value === this.value);
        if (indexOfSelected > -1) {
          const selectedItem = overlay.querySelector(`.select-interface-option:nth-of-type(${indexOfSelected + 1})`);
          if (selectedItem) {
            const interactiveEl = selectedItem.querySelector("ion-radio, ion-checkbox");
            if (interactiveEl) {
              selectedItem.scrollIntoView({ block: "nearest" });
              interactiveEl.setFocus();
            }
            focusVisibleElement(selectedItem);
          }
        } else {
          const firstEnabledOption = overlay.querySelector("ion-radio:not(.radio-disabled), ion-checkbox:not(.checkbox-disabled)");
          if (firstEnabledOption) {
            firstEnabledOption.setFocus();
            focusVisibleElement(firstEnabledOption.closest("ion-item"));
          }
        }
      };
      if (this.interface === "modal") {
        overlay.addEventListener("ionModalWillPresent", scrollSelectedIntoView, { once: true });
      } else if (this.interface === "popover") {
        overlay.addEventListener("ionPopoverWillPresent", scrollSelectedIntoView, { once: true });
      } else {
        const scrollAfterRender = () => {
          requestAnimationFrame(() => {
            scrollSelectedIntoView();
          });
        };
        if (this.interface === "alert") {
          overlay.addEventListener("ionAlertWillPresent", scrollAfterRender, { once: true });
        } else if (this.interface === "action-sheet") {
          overlay.addEventListener("ionActionSheetWillPresent", scrollAfterRender, { once: true });
        }
      }
      overlay.onDidDismiss().then(() => {
        this.overlay = void 0;
        this.isExpanded = false;
        this.ionDismiss.emit();
        this.setFocus();
      });
      yield overlay.present();
      return overlay;
    });
  }
  createOverlay(ev) {
    let selectInterface = this.interface;
    if (selectInterface === "action-sheet" && this.multiple) {
      printIonWarning(`[ion-select] - Interface cannot be "${selectInterface}" with a multi-value select. Using the "alert" interface instead.`);
      selectInterface = "alert";
    }
    if (selectInterface === "popover" && !ev) {
      printIonWarning(`[ion-select] - Interface cannot be a "${selectInterface}" without passing an event. Using the "alert" interface instead.`);
      selectInterface = "alert";
    }
    if (selectInterface === "action-sheet") {
      return this.openActionSheet();
    }
    if (selectInterface === "popover") {
      return this.openPopover(ev);
    }
    if (selectInterface === "modal") {
      return this.openModal();
    }
    return this.openAlert();
  }
  updateOverlayOptions() {
    const overlay = this.overlay;
    if (!overlay) {
      return;
    }
    const childOpts = this.childOpts;
    const value = this.value;
    switch (this.interface) {
      case "action-sheet":
        overlay.buttons = this.createActionSheetButtons(childOpts, value);
        break;
      case "popover":
        const popover = overlay.querySelector("ion-select-popover");
        if (popover) {
          popover.options = this.createOverlaySelectOptions(childOpts, value);
        }
        break;
      case "modal":
        const modal = overlay.querySelector("ion-select-modal");
        if (modal) {
          modal.options = this.createOverlaySelectOptions(childOpts, value);
        }
        break;
      case "alert":
        const inputType = this.multiple ? "checkbox" : "radio";
        overlay.inputs = this.createAlertInputs(childOpts, inputType, value);
        break;
    }
  }
  createActionSheetButtons(data, selectValue) {
    const actionSheetButtons = data.map((option) => {
      const value = getOptionValue(option);
      const copyClasses = Array.from(option.classList).filter((cls) => cls !== "hydrated").join(" ");
      const optClass = `${OPTION_CLASS} ${copyClasses}`;
      return {
        role: isOptionSelected(selectValue, value, this.compareWith) ? "selected" : "",
        text: option.textContent,
        cssClass: optClass,
        handler: () => {
          this.setValue(value);
        }
      };
    });
    actionSheetButtons.push({
      text: this.cancelText,
      role: "cancel",
      handler: () => {
        this.ionCancel.emit();
      }
    });
    return actionSheetButtons;
  }
  createAlertInputs(data, inputType, selectValue) {
    const alertInputs = data.map((option) => {
      const value = getOptionValue(option);
      const copyClasses = Array.from(option.classList).filter((cls) => cls !== "hydrated").join(" ");
      const optClass = `${OPTION_CLASS} ${copyClasses}`;
      return {
        type: inputType,
        cssClass: optClass,
        label: option.textContent || "",
        value,
        checked: isOptionSelected(selectValue, value, this.compareWith),
        disabled: option.disabled
      };
    });
    return alertInputs;
  }
  createOverlaySelectOptions(data, selectValue) {
    const popoverOptions = data.map((option) => {
      const value = getOptionValue(option);
      const copyClasses = Array.from(option.classList).filter((cls) => cls !== "hydrated").join(" ");
      const optClass = `${OPTION_CLASS} ${copyClasses}`;
      return {
        text: option.textContent || "",
        cssClass: optClass,
        value,
        checked: isOptionSelected(selectValue, value, this.compareWith),
        disabled: option.disabled,
        handler: (selected) => {
          this.setValue(selected);
          if (!this.multiple) {
            this.close();
          }
        }
      };
    });
    return popoverOptions;
  }
  openPopover(ev) {
    return __async(this, null, function* () {
      const { fill, labelPlacement } = this;
      const interfaceOptions = this.interfaceOptions;
      const mode = getIonMode(this);
      const showBackdrop = mode === "md" ? false : true;
      const multiple = this.multiple;
      const value = this.value;
      let event = ev;
      let size = "auto";
      const hasFloatingOrStackedLabel = labelPlacement === "floating" || labelPlacement === "stacked";
      if (hasFloatingOrStackedLabel || mode === "md" && fill !== void 0) {
        size = "cover";
      } else {
        event = Object.assign(Object.assign({}, ev), { detail: {
          ionShadowTarget: this.nativeWrapperEl
        } });
      }
      const popoverOpts = Object.assign(Object.assign({
        mode,
        event,
        alignment: "center",
        size,
        showBackdrop
      }, interfaceOptions), { component: "ion-select-popover", cssClass: ["select-popover", interfaceOptions.cssClass], componentProps: {
        header: interfaceOptions.header,
        subHeader: interfaceOptions.subHeader,
        message: interfaceOptions.message,
        multiple,
        value,
        options: this.createOverlaySelectOptions(this.childOpts, value)
      } });
      return popoverController.create(popoverOpts);
    });
  }
  openActionSheet() {
    return __async(this, null, function* () {
      const mode = getIonMode(this);
      const interfaceOptions = this.interfaceOptions;
      const actionSheetOpts = Object.assign(Object.assign({ mode }, interfaceOptions), { buttons: this.createActionSheetButtons(this.childOpts, this.value), cssClass: ["select-action-sheet", interfaceOptions.cssClass] });
      return actionSheetController.create(actionSheetOpts);
    });
  }
  openAlert() {
    return __async(this, null, function* () {
      const interfaceOptions = this.interfaceOptions;
      const inputType = this.multiple ? "checkbox" : "radio";
      const mode = getIonMode(this);
      const alertOpts = Object.assign(Object.assign({ mode }, interfaceOptions), { header: interfaceOptions.header ? interfaceOptions.header : this.labelText, inputs: this.createAlertInputs(this.childOpts, inputType, this.value), buttons: [
        {
          text: this.cancelText,
          role: "cancel",
          handler: () => {
            this.ionCancel.emit();
          }
        },
        {
          text: this.okText,
          handler: (selectedValues) => {
            this.setValue(selectedValues);
          }
        }
      ], cssClass: [
        "select-alert",
        interfaceOptions.cssClass,
        this.multiple ? "multiple-select-alert" : "single-select-alert"
      ] });
      return alertController.create(alertOpts);
    });
  }
  openModal() {
    const { multiple, value, interfaceOptions } = this;
    const mode = getIonMode(this);
    const modalOpts = Object.assign(Object.assign({}, interfaceOptions), { mode, cssClass: ["select-modal", interfaceOptions.cssClass], component: "ion-select-modal", componentProps: {
      header: interfaceOptions.header,
      multiple,
      value,
      options: this.createOverlaySelectOptions(this.childOpts, value)
    } });
    return modalController.create(modalOpts);
  }
  /**
   * Close the select interface.
   */
  close() {
    if (!this.overlay) {
      return Promise.resolve(false);
    }
    return this.overlay.dismiss();
  }
  hasValue() {
    return this.getText() !== "";
  }
  get childOpts() {
    return Array.from(this.el.querySelectorAll("ion-select-option"));
  }
  /**
   * Returns any plaintext associated with
   * the label (either prop or slot).
   * Note: This will not return any custom
   * HTML. Use the `hasLabel` getter if you
   * want to know if any slotted label content
   * was passed.
   */
  get labelText() {
    const { label } = this;
    if (label !== void 0) {
      return label;
    }
    const { labelSlot } = this;
    if (labelSlot !== null) {
      return labelSlot.textContent;
    }
    return;
  }
  getText() {
    const selectedText = this.selectedText;
    if (selectedText != null && selectedText !== "") {
      return selectedText;
    }
    return generateText(this.childOpts, this.value, this.compareWith);
  }
  setFocus() {
    if (this.focusEl) {
      this.focusEl.focus();
    }
  }
  emitStyle() {
    const { disabled } = this;
    const style = {
      "interactive-disabled": disabled
    };
    this.ionStyle.emit(style);
  }
  renderLabel() {
    const { label } = this;
    return h("div", { class: {
      "label-text-wrapper": true,
      "label-text-wrapper-hidden": !this.hasLabel
    }, part: "label" }, label === void 0 ? h("slot", { name: "label" }) : h("div", { class: "label-text" }, label));
  }
  componentDidRender() {
    var _a;
    (_a = this.notchController) === null || _a === void 0 ? void 0 : _a.calculateNotchWidth();
  }
  /**
   * Gets any content passed into the `label` slot,
   * not the <slot> definition.
   */
  get labelSlot() {
    return this.el.querySelector('[slot="label"]');
  }
  /**
   * Returns `true` if label content is provided
   * either by a prop or a content. If you want
   * to get the plaintext value of the label use
   * the `labelText` getter instead.
   */
  get hasLabel() {
    return this.label !== void 0 || this.labelSlot !== null;
  }
  /**
   * Renders the border container
   * when fill="outline".
   */
  renderLabelContainer() {
    const mode = getIonMode(this);
    const hasOutlineFill = mode === "md" && this.fill === "outline";
    if (hasOutlineFill) {
      return [
        h("div", { class: "select-outline-container" }, h("div", { class: "select-outline-start" }), h("div", { class: {
          "select-outline-notch": true,
          "select-outline-notch-hidden": !this.hasLabel
        } }, h("div", { class: "notch-spacer", "aria-hidden": "true", ref: (el) => this.notchSpacerEl = el }, this.label)), h("div", { class: "select-outline-end" })),
        this.renderLabel()
      ];
    }
    return this.renderLabel();
  }
  /**
   * Renders either the placeholder
   * or the selected values based on
   * the state of the select.
   */
  renderSelectText() {
    const { placeholder } = this;
    const displayValue = this.getText();
    let addPlaceholderClass = false;
    let selectText = displayValue;
    if (selectText === "" && placeholder !== void 0) {
      selectText = placeholder;
      addPlaceholderClass = true;
    }
    const selectTextClasses = {
      "select-text": true,
      "select-placeholder": addPlaceholderClass
    };
    const textPart = addPlaceholderClass ? "placeholder" : "text";
    return h("div", { "aria-hidden": "true", class: selectTextClasses, part: textPart }, selectText);
  }
  /**
   * Renders the chevron icon
   * next to the select text.
   */
  renderSelectIcon() {
    const mode = getIonMode(this);
    const { isExpanded, toggleIcon, expandedIcon } = this;
    let icon;
    if (isExpanded && expandedIcon !== void 0) {
      icon = expandedIcon;
    } else {
      const defaultIcon = mode === "ios" ? chevronExpand : caretDownSharp;
      icon = toggleIcon !== null && toggleIcon !== void 0 ? toggleIcon : defaultIcon;
    }
    return h("ion-icon", { class: "select-icon", part: "icon", "aria-hidden": "true", icon });
  }
  get ariaLabel() {
    var _a;
    const { placeholder, inheritedAttributes } = this;
    const displayValue = this.getText();
    const definedLabel = (_a = inheritedAttributes["aria-label"]) !== null && _a !== void 0 ? _a : this.labelText;
    let renderedLabel = displayValue;
    if (renderedLabel === "" && placeholder !== void 0) {
      renderedLabel = placeholder;
    }
    if (definedLabel !== void 0) {
      renderedLabel = renderedLabel === "" ? definedLabel : `${definedLabel}, ${renderedLabel}`;
    }
    return renderedLabel;
  }
  renderListbox() {
    const { disabled, inputId, isExpanded, required } = this;
    return h("button", { disabled, id: inputId, "aria-label": this.ariaLabel, "aria-haspopup": "dialog", "aria-expanded": `${isExpanded}`, "aria-describedby": this.getHintTextID(), "aria-invalid": this.getHintTextID() === this.errorTextId, "aria-required": `${required}`, onFocus: this.onFocus, onBlur: this.onBlur, ref: (focusEl) => this.focusEl = focusEl });
  }
  getHintTextID() {
    const { el, helperText, errorText, helperTextId, errorTextId } = this;
    if (el.classList.contains("ion-touched") && el.classList.contains("ion-invalid") && errorText) {
      return errorTextId;
    }
    if (helperText) {
      return helperTextId;
    }
    return void 0;
  }
  /**
   * Renders the helper text or error text values
   */
  renderHintText() {
    const { helperText, errorText, helperTextId, errorTextId } = this;
    return [
      h("div", { id: helperTextId, class: "helper-text", part: "supporting-text helper-text" }, helperText),
      h("div", { id: errorTextId, class: "error-text", part: "supporting-text error-text" }, errorText)
    ];
  }
  /**
   * Responsible for rendering helper text, and error text. This element
   * should only be rendered if hint text is set.
   */
  renderBottomContent() {
    const { helperText, errorText } = this;
    const hasHintText = !!helperText || !!errorText;
    if (!hasHintText) {
      return;
    }
    return h("div", { class: "select-bottom" }, this.renderHintText());
  }
  render() {
    const { disabled, el, isExpanded, expandedIcon, labelPlacement, justify, placeholder, fill, shape, name, value, hasFocus } = this;
    const mode = getIonMode(this);
    const hasFloatingOrStackedLabel = labelPlacement === "floating" || labelPlacement === "stacked";
    const justifyEnabled = !hasFloatingOrStackedLabel && justify !== void 0;
    const rtl = isRTL(el) ? "rtl" : "ltr";
    const inItem = hostContext("ion-item", this.el);
    const shouldRenderHighlight = mode === "md" && fill !== "outline" && !inItem;
    const hasValue = this.hasValue();
    const hasStartEndSlots = el.querySelector('[slot="start"], [slot="end"]') !== null;
    renderHiddenInput(true, el, name, parseValue(value), disabled);
    const labelShouldFloat = labelPlacement === "stacked" || labelPlacement === "floating" && (hasValue || isExpanded || hasStartEndSlots);
    return h(Host, { key: "c03fb65e8fc9f9aab295e07b282377d57d910519", onClick: this.onClick, class: createColorClasses(this.color, {
      [mode]: true,
      "in-item": inItem,
      "in-item-color": hostContext("ion-item.ion-color", el),
      "select-disabled": disabled,
      "select-expanded": isExpanded,
      "has-expanded-icon": expandedIcon !== void 0,
      "has-value": hasValue,
      "label-floating": labelShouldFloat,
      "has-placeholder": placeholder !== void 0,
      "has-focus": hasFocus,
      // TODO(FW-6451): Remove `ion-focusable` class in favor of `has-focus`.
      "ion-focusable": true,
      [`select-${rtl}`]: true,
      [`select-fill-${fill}`]: fill !== void 0,
      [`select-justify-${justify}`]: justifyEnabled,
      [`select-shape-${shape}`]: shape !== void 0,
      [`select-label-placement-${labelPlacement}`]: true
    }) }, h("label", { key: "0d0c8ec55269adcac625f2899a547f4e7f3e3741", class: "select-wrapper", id: "select-label", onClick: this.onLabelClick }, this.renderLabelContainer(), h("div", { key: "f6dfc93c0e23cbe75a2947abde67d842db2dad78", class: "select-wrapper-inner" }, h("slot", { key: "957bfadf9f101f519091419a362d3abdc2be66f6", name: "start" }), h("div", { key: "ca349202a484e7f2e884533fd330f0b136754f7d", class: "native-wrapper", ref: (el2) => this.nativeWrapperEl = el2, part: "container" }, this.renderSelectText(), this.renderListbox()), h("slot", { key: "f0e62a6533ff1c8f62bd2d27f60b23385c4fa9ed", name: "end" }), !hasFloatingOrStackedLabel && this.renderSelectIcon()), hasFloatingOrStackedLabel && this.renderSelectIcon(), shouldRenderHighlight && h("div", { key: "fb840d46bafafb09898ebeebbe8c181906a3d8a2", class: "select-highlight" })), this.renderBottomContent());
  }
  get el() {
    return getElement(this);
  }
  static get watchers() {
    return {
      "disabled": ["styleChanged"],
      "isExpanded": ["styleChanged"],
      "placeholder": ["styleChanged"],
      "value": ["styleChanged"]
    };
  }
};
var getOptionValue = (el) => {
  const value = el.value;
  return value === void 0 ? el.textContent || "" : value;
};
var parseValue = (value) => {
  if (value == null) {
    return void 0;
  }
  if (Array.isArray(value)) {
    return value.join(",");
  }
  return value.toString();
};
var generateText = (opts, value, compareWith) => {
  if (value === void 0) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.map((v) => textForValue(opts, v, compareWith)).filter((opt) => opt !== null).join(", ");
  } else {
    return textForValue(opts, value, compareWith) || "";
  }
};
var textForValue = (opts, value, compareWith) => {
  const selectOpt = opts.find((opt) => {
    return compareOptions(value, getOptionValue(opt), compareWith);
  });
  return selectOpt ? selectOpt.textContent : null;
};
var selectIds = 0;
var OPTION_CLASS = "select-interface-option";
Select.style = {
  ios: selectIosCss,
  md: selectMdCss
};
var selectOptionCss = ":host{display:none}";
var SelectOption = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.inputId = `ion-selopt-${selectOptionIds++}`;
    this.disabled = false;
  }
  render() {
    return h(Host, { key: "3a70eea9fa03a9acba582180761d18347c72acee", role: "option", id: this.inputId, class: getIonMode(this) });
  }
  get el() {
    return getElement(this);
  }
};
var selectOptionIds = 0;
SelectOption.style = selectOptionCss;
var selectPopoverIosCss = ".sc-ion-select-popover-ios-h ion-list.sc-ion-select-popover-ios{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-list-header.sc-ion-select-popover-ios,ion-label.sc-ion-select-popover-ios{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}.sc-ion-select-popover-ios-h{overflow-y:auto}";
var selectPopoverMdCss = '.sc-ion-select-popover-md-h ion-list.sc-ion-select-popover-md{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-list-header.sc-ion-select-popover-md,ion-label.sc-ion-select-popover-md{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}.sc-ion-select-popover-md-h{overflow-y:auto}ion-list.sc-ion-select-popover-md ion-radio.sc-ion-select-popover-md::part(container),ion-list.sc-ion-select-popover-md ion-radio.sc-ion-select-popover-md [part~="container"]{display:none}ion-list.sc-ion-select-popover-md ion-radio.sc-ion-select-popover-md::part(label),ion-list.sc-ion-select-popover-md ion-radio.sc-ion-select-popover-md [part~="label"]{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}ion-item.sc-ion-select-popover-md{--inner-border-width:0}.item-radio-checked.sc-ion-select-popover-md{--background:rgba(var(--ion-color-primary-rgb, 0, 84, 233), 0.08);--background-focused:var(--ion-color-primary, #0054e9);--background-focused-opacity:0.2;--background-hover:var(--ion-color-primary, #0054e9);--background-hover-opacity:0.12}.item-checkbox-checked.sc-ion-select-popover-md{--background-activated:var(--ion-item-color, var(--ion-text-color, #000));--background-focused:var(--ion-item-color, var(--ion-text-color, #000));--background-hover:var(--ion-item-color, var(--ion-text-color, #000));--color:var(--ion-color-primary, #0054e9)}';
var SelectPopover = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.options = [];
  }
  findOptionFromEvent(ev) {
    const { options } = this;
    return options.find((o) => o.value === ev.target.value);
  }
  /**
   * When an option is selected we need to get the value(s)
   * of the selected option(s) and return it in the option
   * handler
   */
  callOptionHandler(ev) {
    const option = this.findOptionFromEvent(ev);
    const values = this.getValues(ev);
    if (option === null || option === void 0 ? void 0 : option.handler) {
      safeCall(option.handler, values);
    }
  }
  /**
   * Dismisses the host popover that the `ion-select-popover`
   * is rendered within.
   */
  dismissParentPopover() {
    const popover = this.el.closest("ion-popover");
    if (popover) {
      popover.dismiss();
    }
  }
  setChecked(ev) {
    const { multiple } = this;
    const option = this.findOptionFromEvent(ev);
    if (multiple && option) {
      option.checked = ev.detail.checked;
    }
  }
  getValues(ev) {
    const { multiple, options } = this;
    if (multiple) {
      return options.filter((o) => o.checked).map((o) => o.value);
    }
    const option = this.findOptionFromEvent(ev);
    return option ? option.value : void 0;
  }
  renderOptions(options) {
    const { multiple } = this;
    switch (multiple) {
      case true:
        return this.renderCheckboxOptions(options);
      default:
        return this.renderRadioOptions(options);
    }
  }
  renderCheckboxOptions(options) {
    return options.map((option) => h("ion-item", { class: Object.assign({
      // TODO FW-4784
      "item-checkbox-checked": option.checked
    }, getClassMap(option.cssClass)) }, h("ion-checkbox", { value: option.value, disabled: option.disabled, checked: option.checked, justify: "start", labelPlacement: "end", onIonChange: (ev) => {
      this.setChecked(ev);
      this.callOptionHandler(ev);
      forceUpdate(this);
    } }, option.text)));
  }
  renderRadioOptions(options) {
    const checked = options.filter((o) => o.checked).map((o) => o.value)[0];
    return h("ion-radio-group", { value: checked, onIonChange: (ev) => this.callOptionHandler(ev) }, options.map((option) => h("ion-item", { class: Object.assign({
      // TODO FW-4784
      "item-radio-checked": option.value === checked
    }, getClassMap(option.cssClass)) }, h("ion-radio", { value: option.value, disabled: option.disabled, onClick: () => this.dismissParentPopover(), onKeyUp: (ev) => {
      if (ev.key === " ") {
        this.dismissParentPopover();
      }
    } }, option.text))));
  }
  render() {
    const { header, message, options, subHeader } = this;
    const hasSubHeaderOrMessage = subHeader !== void 0 || message !== void 0;
    return h(Host, { key: "ab931b49b59283825bd2afa3f7f995b0e6e05bef", class: getIonMode(this) }, h("ion-list", { key: "3bd12b67832607596b912a73d5b3ae9b954b244d" }, header !== void 0 && h("ion-list-header", { key: "97da930246edf7423a039c030d40e3ff7a5148a3" }, header), hasSubHeaderOrMessage && h("ion-item", { key: "c579df6ea8fac07bb0c59d34c69b149656863224" }, h("ion-label", { key: "af699c5f465710ccb13b8cf8e7be66f0e8acfad1", class: "ion-text-wrap" }, subHeader !== void 0 && h("h3", { key: "df9a936d42064b134e843c7229f314a2a3ec7e80" }, subHeader), message !== void 0 && h("p", { key: "9c3ddad378df00f106afa94e9928cf68c17124dd" }, message))), this.renderOptions(options)));
  }
  get el() {
    return getElement(this);
  }
};
SelectPopover.style = {
  ios: selectPopoverIosCss,
  md: selectPopoverMdCss
};
export {
  Select as ion_select,
  SelectOption as ion_select_option,
  SelectPopover as ion_select_popover
};
/*! Bundled license information:

@ionic/core/dist/esm/ion-select_3.entry.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
//# sourceMappingURL=ion-select_3.entry-L3IZWPB6.js.map
