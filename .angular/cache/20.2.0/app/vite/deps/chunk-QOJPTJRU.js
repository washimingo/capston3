import {
  Keyboard,
  KeyboardResize
} from "./chunk-UDOB7BMP.js";
import {
  doc,
  win
} from "./chunk-LCMILTBF.js";
import {
  __async
} from "./chunk-UL2P3LPA.js";

// node_modules/@ionic/core/dist/esm/keyboard-controller-BaaVITYt.js
var getResizeContainer = (resizeMode) => {
  if (doc === void 0 || resizeMode === KeyboardResize.None || resizeMode === void 0) {
    return null;
  }
  const ionApp = doc.querySelector("ion-app");
  return ionApp !== null && ionApp !== void 0 ? ionApp : doc.body;
};
var getResizeContainerHeight = (resizeMode) => {
  const containerElement = getResizeContainer(resizeMode);
  return containerElement === null ? 0 : containerElement.clientHeight;
};
var createKeyboardController = (keyboardChangeCallback) => __async(null, null, function* () {
  let keyboardWillShowHandler;
  let keyboardWillHideHandler;
  let keyboardVisible;
  let initialResizeContainerHeight;
  const init = () => __async(null, null, function* () {
    const resizeOptions = yield Keyboard.getResizeMode();
    const resizeMode = resizeOptions === void 0 ? void 0 : resizeOptions.mode;
    keyboardWillShowHandler = () => {
      if (initialResizeContainerHeight === void 0) {
        initialResizeContainerHeight = getResizeContainerHeight(resizeMode);
      }
      keyboardVisible = true;
      fireChangeCallback(keyboardVisible, resizeMode);
    };
    keyboardWillHideHandler = () => {
      keyboardVisible = false;
      fireChangeCallback(keyboardVisible, resizeMode);
    };
    win === null || win === void 0 ? void 0 : win.addEventListener("keyboardWillShow", keyboardWillShowHandler);
    win === null || win === void 0 ? void 0 : win.addEventListener("keyboardWillHide", keyboardWillHideHandler);
  });
  const fireChangeCallback = (state, resizeMode) => {
    if (keyboardChangeCallback) {
      keyboardChangeCallback(state, createResizePromiseIfNeeded(resizeMode));
    }
  };
  const createResizePromiseIfNeeded = (resizeMode) => {
    if (
      /**
       * If we are in an SSR environment then there is
       * no window to resize. Additionally, if there
       * is no resize mode or the resize mode is "None"
       * then initialResizeContainerHeight will be 0
       */
      initialResizeContainerHeight === 0 || /**
       * If the keyboard is closed before the webview resizes initially
       * then the webview will never resize.
       */
      initialResizeContainerHeight === getResizeContainerHeight(resizeMode)
    ) {
      return;
    }
    const containerElement = getResizeContainer(resizeMode);
    if (containerElement === null) {
      return;
    }
    return new Promise((resolve) => {
      const callback = () => {
        if (containerElement.clientHeight === initialResizeContainerHeight) {
          ro.disconnect();
          resolve();
        }
      };
      const ro = new ResizeObserver(callback);
      ro.observe(containerElement);
    });
  };
  const destroy = () => {
    win === null || win === void 0 ? void 0 : win.removeEventListener("keyboardWillShow", keyboardWillShowHandler);
    win === null || win === void 0 ? void 0 : win.removeEventListener("keyboardWillHide", keyboardWillHideHandler);
    keyboardWillShowHandler = keyboardWillHideHandler = void 0;
  };
  const isKeyboardVisible = () => keyboardVisible;
  yield init();
  return { init, destroy, isKeyboardVisible };
});

export {
  createKeyboardController
};
/*! Bundled license information:

@ionic/core/dist/esm/keyboard-controller-BaaVITYt.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
//# sourceMappingURL=chunk-QOJPTJRU.js.map
