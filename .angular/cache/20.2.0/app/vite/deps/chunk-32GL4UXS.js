import {
  getCapacitor
} from "./chunk-KH3VUFSP.js";

// node_modules/@ionic/core/dist/esm/haptic-DzAMWJuk.js
var ImpactStyle;
(function(ImpactStyle2) {
  ImpactStyle2["Heavy"] = "HEAVY";
  ImpactStyle2["Medium"] = "MEDIUM";
  ImpactStyle2["Light"] = "LIGHT";
})(ImpactStyle || (ImpactStyle = {}));
var NotificationType;
(function(NotificationType2) {
  NotificationType2["Success"] = "SUCCESS";
  NotificationType2["Warning"] = "WARNING";
  NotificationType2["Error"] = "ERROR";
})(NotificationType || (NotificationType = {}));
var HapticEngine = {
  getEngine() {
    const capacitor = getCapacitor();
    if (capacitor === null || capacitor === void 0 ? void 0 : capacitor.isPluginAvailable("Haptics")) {
      return capacitor.Plugins.Haptics;
    }
    return void 0;
  },
  available() {
    const engine = this.getEngine();
    if (!engine) {
      return false;
    }
    const capacitor = getCapacitor();
    if ((capacitor === null || capacitor === void 0 ? void 0 : capacitor.getPlatform()) === "web") {
      return typeof navigator !== "undefined" && navigator.vibrate !== void 0;
    }
    return true;
  },
  impact(options) {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    engine.impact({ style: options.style });
  },
  notification(options) {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    engine.notification({ type: options.type });
  },
  selection() {
    this.impact({ style: ImpactStyle.Light });
  },
  selectionStart() {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    engine.selectionStart();
  },
  selectionChanged() {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    engine.selectionChanged();
  },
  selectionEnd() {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    engine.selectionEnd();
  }
};
var hapticAvailable = () => {
  return HapticEngine.available();
};
var hapticSelection = () => {
  hapticAvailable() && HapticEngine.selection();
};
var hapticSelectionStart = () => {
  hapticAvailable() && HapticEngine.selectionStart();
};
var hapticSelectionChanged = () => {
  hapticAvailable() && HapticEngine.selectionChanged();
};
var hapticSelectionEnd = () => {
  hapticAvailable() && HapticEngine.selectionEnd();
};
var hapticImpact = (options) => {
  hapticAvailable() && HapticEngine.impact(options);
};

export {
  ImpactStyle,
  hapticSelection,
  hapticSelectionStart,
  hapticSelectionChanged,
  hapticSelectionEnd,
  hapticImpact
};
/*! Bundled license information:

@ionic/core/dist/esm/haptic-DzAMWJuk.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
//# sourceMappingURL=chunk-32GL4UXS.js.map
