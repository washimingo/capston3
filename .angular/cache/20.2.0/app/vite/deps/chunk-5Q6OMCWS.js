import {
  componentOnReady
} from "./chunk-4EKUW6KP.js";
import {
  __async
} from "./chunk-UL2P3LPA.js";

// node_modules/@ionic/core/dist/esm/framework-delegate-BLEBgH06.js
var attachComponent = (delegate, container, component, cssClasses, componentProps, inline) => __async(null, null, function* () {
  var _a;
  if (delegate) {
    return delegate.attachViewToDom(container, component, componentProps, cssClasses);
  }
  if (!inline && typeof component !== "string" && !(component instanceof HTMLElement)) {
    throw new Error("framework delegate is missing");
  }
  const el = typeof component === "string" ? (_a = container.ownerDocument) === null || _a === void 0 ? void 0 : _a.createElement(component) : component;
  if (cssClasses) {
    cssClasses.forEach((c) => el.classList.add(c));
  }
  if (componentProps) {
    Object.assign(el, componentProps);
  }
  container.appendChild(el);
  yield new Promise((resolve) => componentOnReady(el, resolve));
  return el;
});
var detachComponent = (delegate, element) => {
  if (element) {
    if (delegate) {
      const container = element.parentElement;
      return delegate.removeViewFromDom(container, element);
    }
    element.remove();
  }
  return Promise.resolve();
};
var CoreDelegate = () => {
  let BaseComponent;
  let Reference;
  const attachViewToDom = (_0, _1, ..._2) => __async(null, [_0, _1, ..._2], function* (parentElement, userComponent, userComponentProps = {}, cssClasses = []) {
    var _a, _b;
    BaseComponent = parentElement;
    let ChildComponent;
    if (userComponent) {
      const el = typeof userComponent === "string" ? (_a = BaseComponent.ownerDocument) === null || _a === void 0 ? void 0 : _a.createElement(userComponent) : userComponent;
      cssClasses.forEach((c) => el.classList.add(c));
      Object.assign(el, userComponentProps);
      BaseComponent.appendChild(el);
      ChildComponent = el;
      yield new Promise((resolve) => componentOnReady(el, resolve));
    } else if (BaseComponent.children.length > 0 && (BaseComponent.tagName === "ION-MODAL" || BaseComponent.tagName === "ION-POPOVER")) {
      const root = ChildComponent = BaseComponent.children[0];
      if (!root.classList.contains("ion-delegate-host")) {
        const el = (_b = BaseComponent.ownerDocument) === null || _b === void 0 ? void 0 : _b.createElement("div");
        el.classList.add("ion-delegate-host");
        cssClasses.forEach((c) => el.classList.add(c));
        el.append(...BaseComponent.children);
        BaseComponent.appendChild(el);
        ChildComponent = el;
      }
    }
    const app = document.querySelector("ion-app") || document.body;
    Reference = document.createComment("ionic teleport");
    BaseComponent.parentNode.insertBefore(Reference, BaseComponent);
    app.appendChild(BaseComponent);
    return ChildComponent !== null && ChildComponent !== void 0 ? ChildComponent : BaseComponent;
  });
  const removeViewFromDom = () => {
    if (BaseComponent && Reference) {
      Reference.parentNode.insertBefore(BaseComponent, Reference);
      Reference.remove();
    }
    return Promise.resolve();
  };
  return { attachViewToDom, removeViewFromDom };
};

export {
  attachComponent,
  detachComponent,
  CoreDelegate
};
/*! Bundled license information:

@ionic/core/dist/esm/framework-delegate-BLEBgH06.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
//# sourceMappingURL=chunk-5Q6OMCWS.js.map
