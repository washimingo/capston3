import {
  KEYBOARD_DID_OPEN
} from "./chunk-QGLHSLIO.js";
import {
  disableContentScrollY,
  findClosestIonContent,
  findIonContent,
  isIonContent,
  printIonContentErrorMsg,
  resetContentScrollY
} from "./chunk-UJUQXL7K.js";
import "./chunk-UDOB7BMP.js";
import {
  createLockController
} from "./chunk-RU6372SK.js";
import {
  getCapacitor
} from "./chunk-KH3VUFSP.js";
import {
  getTimeGivenProgression
} from "./chunk-34QX6F67.js";
import {
  BACKDROP,
  FOCUS_TRAP_DISABLE_CLASS,
  GESTURE,
  OVERLAY_GESTURE_PRIORITY,
  createTriggerController,
  dismiss,
  eventMethod,
  prepareOverlay,
  present,
  setOverlayId
} from "./chunk-5VXP7OLQ.js";
import {
  CoreDelegate,
  attachComponent,
  detachComponent
} from "./chunk-5Q6OMCWS.js";
import {
  getClassMap
} from "./chunk-7ADYHXQV.js";
import {
  getIonMode
} from "./chunk-GY2AZYBV.js";
import {
  createGesture
} from "./chunk-Z3OEOVFM.js";
import "./chunk-QA2SYHF5.js";
import "./chunk-OQQXWWMH.js";
import {
  deepReady,
  waitForMount
} from "./chunk-YHSQCZZH.js";
import {
  createAnimation
} from "./chunk-EHT7Z4UK.js";
import {
  clamp,
  getElementRoot,
  hasLazyBuild,
  inheritAttributes,
  raf
} from "./chunk-4EKUW6KP.js";
import {
  win
} from "./chunk-LCMILTBF.js";
import {
  Host,
  config,
  createEvent,
  getElement,
  h,
  printIonWarning,
  registerInstance,
  writeTask
} from "./chunk-EUKJBSCI.js";
import {
  __async
} from "./chunk-UL2P3LPA.js";

// node_modules/@ionic/core/dist/esm/ion-modal.entry.js
var Style;
(function(Style2) {
  Style2["Dark"] = "DARK";
  Style2["Light"] = "LIGHT";
  Style2["Default"] = "DEFAULT";
})(Style || (Style = {}));
var StatusBar = {
  getEngine() {
    const capacitor = getCapacitor();
    if (capacitor === null || capacitor === void 0 ? void 0 : capacitor.isPluginAvailable("StatusBar")) {
      return capacitor.Plugins.StatusBar;
    }
    return void 0;
  },
  setStyle(options) {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    engine.setStyle(options);
  },
  getStyle: function() {
    return __async(this, null, function* () {
      const engine = this.getEngine();
      if (!engine) {
        return Style.Default;
      }
      const { style } = yield engine.getInfo();
      return style;
    });
  }
};
var getBackdropValueForSheet = (x, backdropBreakpoint) => {
  if (backdropBreakpoint === 1) {
    return 0;
  }
  const slope = 1 / (1 - backdropBreakpoint);
  const b = -(backdropBreakpoint * slope);
  return x * slope + b;
};
var setCardStatusBarDark = () => {
  if (!win || win.innerWidth >= 768) {
    return;
  }
  StatusBar.setStyle({ style: Style.Dark });
};
var setCardStatusBarDefault = (defaultStyle = Style.Default) => {
  if (!win || win.innerWidth >= 768) {
    return;
  }
  StatusBar.setStyle({ style: defaultStyle });
};
var handleCanDismiss = (el, animation) => __async(null, null, function* () {
  if (typeof el.canDismiss !== "function") {
    return;
  }
  const shouldDismiss = yield el.canDismiss(void 0, GESTURE);
  if (!shouldDismiss) {
    return;
  }
  if (animation.isRunning()) {
    animation.onFinish(() => {
      el.dismiss(void 0, "handler");
    }, { oneTimeCallback: true });
  } else {
    el.dismiss(void 0, "handler");
  }
});
var calculateSpringStep = (t) => {
  return 255275e-8 * 2.71828 ** (-14.9619 * t) - 1.00255 * 2.71828 ** (-0.0380968 * t) + 1;
};
var SwipeToCloseDefaults = {
  MIN_PRESENTING_SCALE: 0.915
};
var createSwipeToCloseGesture = (el, animation, statusBarStyle, onDismiss) => {
  const DISMISS_THRESHOLD = 0.5;
  const height = el.offsetHeight;
  let isOpen = false;
  let canDismissBlocksGesture = false;
  let contentEl = null;
  let scrollEl = null;
  const canDismissMaxStep = 0.2;
  let initialScrollY = true;
  let lastStep = 0;
  const getScrollY = () => {
    if (contentEl && isIonContent(contentEl)) {
      return contentEl.scrollY;
    } else {
      return true;
    }
  };
  const canStart = (detail) => {
    const target = detail.event.target;
    if (target === null || !target.closest) {
      return true;
    }
    contentEl = findClosestIonContent(target);
    if (contentEl) {
      if (isIonContent(contentEl)) {
        const root = getElementRoot(contentEl);
        scrollEl = root.querySelector(".inner-scroll");
      } else {
        scrollEl = contentEl;
      }
      const hasRefresherInContent = !!contentEl.querySelector("ion-refresher");
      return !hasRefresherInContent && scrollEl.scrollTop === 0;
    }
    const footer = target.closest("ion-footer");
    if (footer === null) {
      return true;
    }
    return false;
  };
  const onStart = (detail) => {
    const { deltaY } = detail;
    initialScrollY = getScrollY();
    canDismissBlocksGesture = el.canDismiss !== void 0 && el.canDismiss !== true;
    if (deltaY > 0 && contentEl) {
      disableContentScrollY(contentEl);
    }
    animation.progressStart(true, isOpen ? 1 : 0);
  };
  const onMove = (detail) => {
    const { deltaY } = detail;
    if (deltaY > 0 && contentEl) {
      disableContentScrollY(contentEl);
    }
    const step = detail.deltaY / height;
    const isAttemptingDismissWithCanDismiss = step >= 0 && canDismissBlocksGesture;
    const maxStep = isAttemptingDismissWithCanDismiss ? canDismissMaxStep : 0.9999;
    const processedStep = isAttemptingDismissWithCanDismiss ? calculateSpringStep(step / maxStep) : step;
    const clampedStep = clamp(1e-4, processedStep, maxStep);
    animation.progressStep(clampedStep);
    if (clampedStep >= DISMISS_THRESHOLD && lastStep < DISMISS_THRESHOLD) {
      setCardStatusBarDefault(statusBarStyle);
    } else if (clampedStep < DISMISS_THRESHOLD && lastStep >= DISMISS_THRESHOLD) {
      setCardStatusBarDark();
    }
    lastStep = clampedStep;
  };
  const onEnd = (detail) => {
    const velocity = detail.velocityY;
    const step = detail.deltaY / height;
    const isAttemptingDismissWithCanDismiss = step >= 0 && canDismissBlocksGesture;
    const maxStep = isAttemptingDismissWithCanDismiss ? canDismissMaxStep : 0.9999;
    const processedStep = isAttemptingDismissWithCanDismiss ? calculateSpringStep(step / maxStep) : step;
    const clampedStep = clamp(1e-4, processedStep, maxStep);
    const threshold = (detail.deltaY + velocity * 1e3) / height;
    const shouldComplete = !isAttemptingDismissWithCanDismiss && threshold >= DISMISS_THRESHOLD;
    let newStepValue = shouldComplete ? -1e-3 : 1e-3;
    if (!shouldComplete) {
      animation.easing("cubic-bezier(1, 0, 0.68, 0.28)");
      newStepValue += getTimeGivenProgression([0, 0], [1, 0], [0.68, 0.28], [1, 1], clampedStep)[0];
    } else {
      animation.easing("cubic-bezier(0.32, 0.72, 0, 1)");
      newStepValue += getTimeGivenProgression([0, 0], [0.32, 0.72], [0, 1], [1, 1], clampedStep)[0];
    }
    const duration = shouldComplete ? computeDuration(step * height, velocity) : computeDuration((1 - clampedStep) * height, velocity);
    isOpen = shouldComplete;
    gesture.enable(false);
    if (contentEl) {
      resetContentScrollY(contentEl, initialScrollY);
    }
    animation.onFinish(() => {
      if (!shouldComplete) {
        gesture.enable(true);
      }
    }).progressEnd(shouldComplete ? 1 : 0, newStepValue, duration);
    if (isAttemptingDismissWithCanDismiss && clampedStep > maxStep / 4) {
      handleCanDismiss(el, animation);
    } else if (shouldComplete) {
      onDismiss();
    }
  };
  const gesture = createGesture({
    el,
    gestureName: "modalSwipeToClose",
    gesturePriority: OVERLAY_GESTURE_PRIORITY,
    direction: "y",
    threshold: 10,
    canStart,
    onStart,
    onMove,
    onEnd
  });
  return gesture;
};
var computeDuration = (remaining, velocity) => {
  return clamp(400, remaining / Math.abs(velocity * 1.1), 500);
};
var createSheetEnterAnimation = (opts) => {
  const { currentBreakpoint, backdropBreakpoint, expandToScroll } = opts;
  const shouldShowBackdrop = backdropBreakpoint === void 0 || backdropBreakpoint < currentBreakpoint;
  const initialBackdrop = shouldShowBackdrop ? `calc(var(--backdrop-opacity) * ${currentBreakpoint})` : "0";
  const backdropAnimation = createAnimation("backdropAnimation").fromTo("opacity", 0, initialBackdrop);
  if (shouldShowBackdrop) {
    backdropAnimation.beforeStyles({
      "pointer-events": "none"
    }).afterClearStyles(["pointer-events"]);
  }
  const wrapperAnimation = createAnimation("wrapperAnimation").keyframes([
    { offset: 0, opacity: 1, transform: "translateY(100%)" },
    { offset: 1, opacity: 1, transform: `translateY(${100 - currentBreakpoint * 100}%)` }
  ]);
  const contentAnimation = !expandToScroll ? createAnimation("contentAnimation").keyframes([
    { offset: 0, opacity: 1, maxHeight: `${(1 - currentBreakpoint) * 100}%` },
    { offset: 1, opacity: 1, maxHeight: `${currentBreakpoint * 100}%` }
  ]) : void 0;
  return { wrapperAnimation, backdropAnimation, contentAnimation };
};
var createSheetLeaveAnimation = (opts) => {
  const { currentBreakpoint, backdropBreakpoint } = opts;
  const backdropValue = `calc(var(--backdrop-opacity) * ${getBackdropValueForSheet(currentBreakpoint, backdropBreakpoint)})`;
  const defaultBackdrop = [
    { offset: 0, opacity: backdropValue },
    { offset: 1, opacity: 0 }
  ];
  const customBackdrop = [
    { offset: 0, opacity: backdropValue },
    { offset: backdropBreakpoint, opacity: 0 },
    { offset: 1, opacity: 0 }
  ];
  const backdropAnimation = createAnimation("backdropAnimation").keyframes(backdropBreakpoint !== 0 ? customBackdrop : defaultBackdrop);
  const wrapperAnimation = createAnimation("wrapperAnimation").keyframes([
    { offset: 0, opacity: 1, transform: `translateY(${100 - currentBreakpoint * 100}%)` },
    { offset: 1, opacity: 1, transform: `translateY(100%)` }
  ]);
  return { wrapperAnimation, backdropAnimation };
};
var createEnterAnimation$1 = () => {
  const backdropAnimation = createAnimation().fromTo("opacity", 0.01, "var(--backdrop-opacity)").beforeStyles({
    "pointer-events": "none"
  }).afterClearStyles(["pointer-events"]);
  const wrapperAnimation = createAnimation().fromTo("transform", "translateY(100vh)", "translateY(0vh)");
  return { backdropAnimation, wrapperAnimation, contentAnimation: void 0 };
};
var iosEnterAnimation = (baseEl, opts) => {
  const { presentingEl, currentBreakpoint, expandToScroll } = opts;
  const root = getElementRoot(baseEl);
  const { wrapperAnimation, backdropAnimation, contentAnimation } = currentBreakpoint !== void 0 ? createSheetEnterAnimation(opts) : createEnterAnimation$1();
  backdropAnimation.addElement(root.querySelector("ion-backdrop"));
  wrapperAnimation.addElement(root.querySelectorAll(".modal-wrapper, .modal-shadow")).beforeStyles({ opacity: 1 });
  !expandToScroll && (contentAnimation === null || contentAnimation === void 0 ? void 0 : contentAnimation.addElement(baseEl.querySelector(".ion-page")));
  const baseAnimation = createAnimation("entering-base").addElement(baseEl).easing("cubic-bezier(0.32,0.72,0,1)").duration(500).addAnimation([wrapperAnimation]);
  if (contentAnimation) {
    baseAnimation.addAnimation(contentAnimation);
  }
  if (presentingEl) {
    const isPortrait = window.innerWidth < 768;
    const hasCardModal = presentingEl.tagName === "ION-MODAL" && presentingEl.presentingElement !== void 0;
    const presentingElRoot = getElementRoot(presentingEl);
    const presentingAnimation = createAnimation().beforeStyles({
      transform: "translateY(0)",
      "transform-origin": "top center",
      overflow: "hidden"
    });
    const bodyEl = document.body;
    if (isPortrait) {
      const transformOffset = !CSS.supports("width", "max(0px, 1px)") ? "30px" : "max(30px, var(--ion-safe-area-top))";
      const modalTransform = hasCardModal ? "-10px" : transformOffset;
      const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
      const finalTransform = `translateY(${modalTransform}) scale(${toPresentingScale})`;
      presentingAnimation.afterStyles({
        transform: finalTransform
      }).beforeAddWrite(() => bodyEl.style.setProperty("background-color", "black")).addElement(presentingEl).keyframes([
        { offset: 0, filter: "contrast(1)", transform: "translateY(0px) scale(1)", borderRadius: "0px" },
        { offset: 1, filter: "contrast(0.85)", transform: finalTransform, borderRadius: "10px 10px 0 0" }
      ]);
      baseAnimation.addAnimation(presentingAnimation);
    } else {
      baseAnimation.addAnimation(backdropAnimation);
      if (!hasCardModal) {
        wrapperAnimation.fromTo("opacity", "0", "1");
      } else {
        const toPresentingScale = hasCardModal ? SwipeToCloseDefaults.MIN_PRESENTING_SCALE : 1;
        const finalTransform = `translateY(-10px) scale(${toPresentingScale})`;
        presentingAnimation.afterStyles({
          transform: finalTransform
        }).addElement(presentingElRoot.querySelector(".modal-wrapper")).keyframes([
          { offset: 0, filter: "contrast(1)", transform: "translateY(0) scale(1)" },
          { offset: 1, filter: "contrast(0.85)", transform: finalTransform }
        ]);
        const shadowAnimation = createAnimation().afterStyles({
          transform: finalTransform
        }).addElement(presentingElRoot.querySelector(".modal-shadow")).keyframes([
          { offset: 0, opacity: "1", transform: "translateY(0) scale(1)" },
          { offset: 1, opacity: "0", transform: finalTransform }
        ]);
        baseAnimation.addAnimation([presentingAnimation, shadowAnimation]);
      }
    }
  } else {
    baseAnimation.addAnimation(backdropAnimation);
  }
  return baseAnimation;
};
var createLeaveAnimation$1 = () => {
  const backdropAnimation = createAnimation().fromTo("opacity", "var(--backdrop-opacity)", 0);
  const wrapperAnimation = createAnimation().fromTo("transform", "translateY(0vh)", "translateY(100vh)");
  return { backdropAnimation, wrapperAnimation };
};
var iosLeaveAnimation = (baseEl, opts, duration = 500) => {
  const { presentingEl, currentBreakpoint } = opts;
  const root = getElementRoot(baseEl);
  const { wrapperAnimation, backdropAnimation } = currentBreakpoint !== void 0 ? createSheetLeaveAnimation(opts) : createLeaveAnimation$1();
  backdropAnimation.addElement(root.querySelector("ion-backdrop"));
  wrapperAnimation.addElement(root.querySelectorAll(".modal-wrapper, .modal-shadow")).beforeStyles({ opacity: 1 });
  const baseAnimation = createAnimation("leaving-base").addElement(baseEl).easing("cubic-bezier(0.32,0.72,0,1)").duration(duration).addAnimation(wrapperAnimation);
  if (presentingEl) {
    const isPortrait = window.innerWidth < 768;
    const hasCardModal = presentingEl.tagName === "ION-MODAL" && presentingEl.presentingElement !== void 0;
    const presentingElRoot = getElementRoot(presentingEl);
    const presentingAnimation = createAnimation().beforeClearStyles(["transform"]).afterClearStyles(["transform"]).onFinish((currentStep) => {
      if (currentStep !== 1) {
        return;
      }
      presentingEl.style.setProperty("overflow", "");
      const numModals = Array.from(bodyEl.querySelectorAll("ion-modal:not(.overlay-hidden)")).filter((m) => m.presentingElement !== void 0).length;
      if (numModals <= 1) {
        bodyEl.style.setProperty("background-color", "");
      }
    });
    const bodyEl = document.body;
    if (isPortrait) {
      const transformOffset = !CSS.supports("width", "max(0px, 1px)") ? "30px" : "max(30px, var(--ion-safe-area-top))";
      const modalTransform = hasCardModal ? "-10px" : transformOffset;
      const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
      const finalTransform = `translateY(${modalTransform}) scale(${toPresentingScale})`;
      presentingAnimation.addElement(presentingEl).keyframes([
        { offset: 0, filter: "contrast(0.85)", transform: finalTransform, borderRadius: "10px 10px 0 0" },
        { offset: 1, filter: "contrast(1)", transform: "translateY(0px) scale(1)", borderRadius: "0px" }
      ]);
      baseAnimation.addAnimation(presentingAnimation);
    } else {
      baseAnimation.addAnimation(backdropAnimation);
      if (!hasCardModal) {
        wrapperAnimation.fromTo("opacity", "1", "0");
      } else {
        const toPresentingScale = hasCardModal ? SwipeToCloseDefaults.MIN_PRESENTING_SCALE : 1;
        const finalTransform = `translateY(-10px) scale(${toPresentingScale})`;
        presentingAnimation.addElement(presentingElRoot.querySelector(".modal-wrapper")).afterStyles({
          transform: "translate3d(0, 0, 0)"
        }).keyframes([
          { offset: 0, filter: "contrast(0.85)", transform: finalTransform },
          { offset: 1, filter: "contrast(1)", transform: "translateY(0) scale(1)" }
        ]);
        const shadowAnimation = createAnimation().addElement(presentingElRoot.querySelector(".modal-shadow")).afterStyles({
          transform: "translateY(0) scale(1)"
        }).keyframes([
          { offset: 0, opacity: "0", transform: finalTransform },
          { offset: 1, opacity: "1", transform: "translateY(0) scale(1)" }
        ]);
        baseAnimation.addAnimation([presentingAnimation, shadowAnimation]);
      }
    }
  } else {
    baseAnimation.addAnimation(backdropAnimation);
  }
  return baseAnimation;
};
var portraitToLandscapeTransition = (baseEl, opts, duration = 300) => {
  const { presentingEl } = opts;
  if (!presentingEl) {
    return createAnimation("portrait-to-landscape-transition");
  }
  const presentingElIsCardModal = presentingEl.tagName === "ION-MODAL" && presentingEl.presentingElement !== void 0;
  const presentingElRoot = getElementRoot(presentingEl);
  const bodyEl = document.body;
  const baseAnimation = createAnimation("portrait-to-landscape-transition").addElement(baseEl).easing("cubic-bezier(0.32,0.72,0,1)").duration(duration);
  const presentingAnimation = createAnimation().beforeStyles({
    transform: "translateY(0)",
    "transform-origin": "top center",
    overflow: "hidden"
  });
  if (!presentingElIsCardModal) {
    const root = getElementRoot(baseEl);
    const wrapperAnimation = createAnimation().addElement(root.querySelectorAll(".modal-wrapper, .modal-shadow")).fromTo("opacity", "1", "1");
    const backdropAnimation = createAnimation().addElement(root.querySelector("ion-backdrop")).fromTo("opacity", "var(--backdrop-opacity)", "var(--backdrop-opacity)");
    const transformOffset = !CSS.supports("width", "max(0px, 1px)") ? "30px" : "max(30px, var(--ion-safe-area-top))";
    const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
    const fromTransform = `translateY(${transformOffset}) scale(${toPresentingScale})`;
    presentingAnimation.addElement(presentingEl).afterStyles({
      transform: "translateY(0px) scale(1)",
      "border-radius": "0px"
    }).beforeAddWrite(() => bodyEl.style.setProperty("background-color", "")).fromTo("transform", fromTransform, "translateY(0px) scale(1)").fromTo("filter", "contrast(0.85)", "contrast(1)").fromTo("border-radius", "10px 10px 0 0", "0px");
    baseAnimation.addAnimation([presentingAnimation, wrapperAnimation, backdropAnimation]);
  } else {
    const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
    const fromTransform = `translateY(-10px) scale(${toPresentingScale})`;
    const toTransform = `translateY(0px) scale(1)`;
    presentingAnimation.addElement(presentingEl).afterStyles({
      transform: toTransform
    }).fromTo("transform", fromTransform, toTransform).fromTo("filter", "contrast(0.85)", "contrast(1)");
    const shadowAnimation = createAnimation().addElement(presentingElRoot.querySelector(".modal-shadow")).afterStyles({
      transform: toTransform,
      opacity: "0"
    }).fromTo("transform", fromTransform, toTransform);
    baseAnimation.addAnimation([presentingAnimation, shadowAnimation]);
  }
  return baseAnimation;
};
var landscapeToPortraitTransition = (baseEl, opts, duration = 300) => {
  const { presentingEl } = opts;
  if (!presentingEl) {
    return createAnimation("landscape-to-portrait-transition");
  }
  const presentingElIsCardModal = presentingEl.tagName === "ION-MODAL" && presentingEl.presentingElement !== void 0;
  const presentingElRoot = getElementRoot(presentingEl);
  const bodyEl = document.body;
  const baseAnimation = createAnimation("landscape-to-portrait-transition").addElement(baseEl).easing("cubic-bezier(0.32,0.72,0,1)").duration(duration);
  const presentingAnimation = createAnimation().beforeStyles({
    transform: "translateY(0)",
    "transform-origin": "top center",
    overflow: "hidden"
  });
  if (!presentingElIsCardModal) {
    const root = getElementRoot(baseEl);
    const wrapperAnimation = createAnimation().addElement(root.querySelectorAll(".modal-wrapper, .modal-shadow")).fromTo("opacity", "1", "1");
    const backdropAnimation = createAnimation().addElement(root.querySelector("ion-backdrop")).fromTo("opacity", "var(--backdrop-opacity)", "var(--backdrop-opacity)");
    const transformOffset = !CSS.supports("width", "max(0px, 1px)") ? "30px" : "max(30px, var(--ion-safe-area-top))";
    const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
    const toTransform = `translateY(${transformOffset}) scale(${toPresentingScale})`;
    presentingAnimation.addElement(presentingEl).afterStyles({
      transform: toTransform
    }).beforeAddWrite(() => bodyEl.style.setProperty("background-color", "black")).keyframes([
      { offset: 0, transform: "translateY(0px) scale(1)", filter: "contrast(1)", borderRadius: "0px" },
      { offset: 0.2, transform: "translateY(0px) scale(1)", filter: "contrast(1)", borderRadius: "10px 10px 0 0" },
      { offset: 1, transform: toTransform, filter: "contrast(0.85)", borderRadius: "10px 10px 0 0" }
    ]);
    baseAnimation.addAnimation([presentingAnimation, wrapperAnimation, backdropAnimation]);
  } else {
    const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
    const fromTransform = `translateY(-10px) scale(${toPresentingScale})`;
    const toTransform = `translateY(0) scale(1)`;
    presentingAnimation.addElement(presentingEl).afterStyles({
      transform: toTransform
    }).fromTo("transform", fromTransform, toTransform);
    const shadowAnimation = createAnimation().addElement(presentingElRoot.querySelector(".modal-shadow")).afterStyles({
      transform: toTransform,
      opacity: "0"
    }).fromTo("transform", fromTransform, toTransform);
    baseAnimation.addAnimation([presentingAnimation, shadowAnimation]);
  }
  return baseAnimation;
};
var createEnterAnimation = () => {
  const backdropAnimation = createAnimation().fromTo("opacity", 0.01, "var(--backdrop-opacity)").beforeStyles({
    "pointer-events": "none"
  }).afterClearStyles(["pointer-events"]);
  const wrapperAnimation = createAnimation().keyframes([
    { offset: 0, opacity: 0.01, transform: "translateY(40px)" },
    { offset: 1, opacity: 1, transform: `translateY(0px)` }
  ]);
  return { backdropAnimation, wrapperAnimation, contentAnimation: void 0 };
};
var mdEnterAnimation = (baseEl, opts) => {
  const { currentBreakpoint, expandToScroll } = opts;
  const root = getElementRoot(baseEl);
  const { wrapperAnimation, backdropAnimation, contentAnimation } = currentBreakpoint !== void 0 ? createSheetEnterAnimation(opts) : createEnterAnimation();
  backdropAnimation.addElement(root.querySelector("ion-backdrop"));
  wrapperAnimation.addElement(root.querySelector(".modal-wrapper"));
  !expandToScroll && (contentAnimation === null || contentAnimation === void 0 ? void 0 : contentAnimation.addElement(baseEl.querySelector(".ion-page")));
  const baseAnimation = createAnimation().addElement(baseEl).easing("cubic-bezier(0.36,0.66,0.04,1)").duration(280).addAnimation([backdropAnimation, wrapperAnimation]);
  if (contentAnimation) {
    baseAnimation.addAnimation(contentAnimation);
  }
  return baseAnimation;
};
var createLeaveAnimation = () => {
  const backdropAnimation = createAnimation().fromTo("opacity", "var(--backdrop-opacity)", 0);
  const wrapperAnimation = createAnimation().keyframes([
    { offset: 0, opacity: 0.99, transform: `translateY(0px)` },
    { offset: 1, opacity: 0, transform: "translateY(40px)" }
  ]);
  return { backdropAnimation, wrapperAnimation };
};
var mdLeaveAnimation = (baseEl, opts) => {
  const { currentBreakpoint } = opts;
  const root = getElementRoot(baseEl);
  const { wrapperAnimation, backdropAnimation } = currentBreakpoint !== void 0 ? createSheetLeaveAnimation(opts) : createLeaveAnimation();
  backdropAnimation.addElement(root.querySelector("ion-backdrop"));
  wrapperAnimation.addElement(root.querySelector(".modal-wrapper"));
  const baseAnimation = createAnimation().easing("cubic-bezier(0.47,0,0.745,0.715)").duration(200).addAnimation([backdropAnimation, wrapperAnimation]);
  return baseAnimation;
};
var createSheetGesture = (baseEl, backdropEl, wrapperEl, initialBreakpoint, backdropBreakpoint, animation, breakpoints = [], expandToScroll, getCurrentBreakpoint, onDismiss, onBreakpointChange) => {
  const defaultBackdrop = [
    { offset: 0, opacity: "var(--backdrop-opacity)" },
    { offset: 1, opacity: 0.01 }
  ];
  const customBackdrop = [
    { offset: 0, opacity: "var(--backdrop-opacity)" },
    { offset: 1 - backdropBreakpoint, opacity: 0 },
    { offset: 1, opacity: 0 }
  ];
  const SheetDefaults = {
    WRAPPER_KEYFRAMES: [
      { offset: 0, transform: "translateY(0%)" },
      { offset: 1, transform: "translateY(100%)" }
    ],
    BACKDROP_KEYFRAMES: backdropBreakpoint !== 0 ? customBackdrop : defaultBackdrop,
    CONTENT_KEYFRAMES: [
      { offset: 0, maxHeight: "100%" },
      { offset: 1, maxHeight: "0%" }
    ]
  };
  const contentEl = baseEl.querySelector("ion-content");
  const height = wrapperEl.clientHeight;
  let currentBreakpoint = initialBreakpoint;
  let offset = 0;
  let canDismissBlocksGesture = false;
  let cachedScrollEl = null;
  let cachedFooterEls = null;
  let cachedFooterYPosition = null;
  let currentFooterState = null;
  const canDismissMaxStep = 0.95;
  const maxBreakpoint = breakpoints[breakpoints.length - 1];
  const minBreakpoint = breakpoints[0];
  const wrapperAnimation = animation.childAnimations.find((ani) => ani.id === "wrapperAnimation");
  const backdropAnimation = animation.childAnimations.find((ani) => ani.id === "backdropAnimation");
  const contentAnimation = animation.childAnimations.find((ani) => ani.id === "contentAnimation");
  const enableBackdrop = () => {
    baseEl.style.setProperty("pointer-events", "auto");
    backdropEl.style.setProperty("pointer-events", "auto");
    baseEl.classList.remove(FOCUS_TRAP_DISABLE_CLASS);
  };
  const disableBackdrop = () => {
    baseEl.style.setProperty("pointer-events", "none");
    backdropEl.style.setProperty("pointer-events", "none");
    baseEl.classList.add(FOCUS_TRAP_DISABLE_CLASS);
  };
  const swapFooterPosition = (newPosition) => {
    if (!cachedFooterEls) {
      cachedFooterEls = Array.from(baseEl.querySelectorAll("ion-footer"));
      if (!cachedFooterEls.length) {
        return;
      }
    }
    const page = baseEl.querySelector(".ion-page");
    currentFooterState = newPosition;
    if (newPosition === "stationary") {
      cachedFooterEls.forEach((cachedFooterEl) => {
        cachedFooterEl.classList.remove("modal-footer-moving");
        cachedFooterEl.style.removeProperty("position");
        cachedFooterEl.style.removeProperty("width");
        cachedFooterEl.style.removeProperty("height");
        cachedFooterEl.style.removeProperty("top");
        cachedFooterEl.style.removeProperty("left");
        page === null || page === void 0 ? void 0 : page.style.removeProperty("padding-bottom");
        page === null || page === void 0 ? void 0 : page.appendChild(cachedFooterEl);
      });
    } else {
      let footerHeights = 0;
      cachedFooterEls.forEach((cachedFooterEl, index) => {
        const cachedFooterElRect = cachedFooterEl.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();
        footerHeights += cachedFooterEl.clientHeight;
        const absoluteTop = cachedFooterElRect.top - bodyRect.top;
        const absoluteLeft = cachedFooterElRect.left - bodyRect.left;
        cachedFooterEl.style.setProperty("--pinned-width", `${cachedFooterEl.clientWidth}px`);
        cachedFooterEl.style.setProperty("--pinned-height", `${cachedFooterEl.clientHeight}px`);
        cachedFooterEl.style.setProperty("--pinned-top", `${absoluteTop}px`);
        cachedFooterEl.style.setProperty("--pinned-left", `${absoluteLeft}px`);
        if (index === 0) {
          cachedFooterYPosition = absoluteTop;
          const header = baseEl.querySelector("ion-header");
          if (header) {
            cachedFooterYPosition -= header.clientHeight;
          }
        }
      });
      cachedFooterEls.forEach((cachedFooterEl) => {
        page === null || page === void 0 ? void 0 : page.style.setProperty("padding-bottom", `${footerHeights}px`);
        cachedFooterEl.classList.add("modal-footer-moving");
        cachedFooterEl.style.setProperty("position", "absolute");
        cachedFooterEl.style.setProperty("width", "var(--pinned-width)");
        cachedFooterEl.style.setProperty("height", "var(--pinned-height)");
        cachedFooterEl.style.setProperty("top", "var(--pinned-top)");
        cachedFooterEl.style.setProperty("left", "var(--pinned-left)");
        document.body.appendChild(cachedFooterEl);
      });
    }
  };
  if (wrapperAnimation && backdropAnimation) {
    wrapperAnimation.keyframes([...SheetDefaults.WRAPPER_KEYFRAMES]);
    backdropAnimation.keyframes([...SheetDefaults.BACKDROP_KEYFRAMES]);
    contentAnimation === null || contentAnimation === void 0 ? void 0 : contentAnimation.keyframes([...SheetDefaults.CONTENT_KEYFRAMES]);
    animation.progressStart(true, 1 - currentBreakpoint);
    const shouldEnableBackdrop = currentBreakpoint > backdropBreakpoint;
    if (shouldEnableBackdrop) {
      enableBackdrop();
    } else {
      disableBackdrop();
    }
  }
  if (contentEl && currentBreakpoint !== maxBreakpoint && expandToScroll) {
    contentEl.scrollY = false;
  }
  const canStart = (detail) => {
    const contentEl2 = findClosestIonContent(detail.event.target);
    currentBreakpoint = getCurrentBreakpoint();
    if (!expandToScroll && contentEl2) {
      const scrollEl = isIonContent(contentEl2) ? getElementRoot(contentEl2).querySelector(".inner-scroll") : contentEl2;
      return scrollEl.scrollTop === 0;
    }
    if (currentBreakpoint === 1 && contentEl2) {
      const scrollEl = isIonContent(contentEl2) ? getElementRoot(contentEl2).querySelector(".inner-scroll") : contentEl2;
      const hasRefresherInContent = !!contentEl2.querySelector("ion-refresher");
      return !hasRefresherInContent && scrollEl.scrollTop === 0;
    }
    return true;
  };
  const onStart = (detail) => {
    canDismissBlocksGesture = baseEl.canDismiss !== void 0 && baseEl.canDismiss !== true && minBreakpoint === 0;
    if (!expandToScroll) {
      const targetEl = findClosestIonContent(detail.event.target);
      cachedScrollEl = targetEl && isIonContent(targetEl) ? getElementRoot(targetEl).querySelector(".inner-scroll") : targetEl;
    }
    if (!expandToScroll) {
      swapFooterPosition("moving");
    }
    if (detail.deltaY > 0 && contentEl) {
      contentEl.scrollY = false;
    }
    raf(() => {
      baseEl.focus();
    });
    animation.progressStart(true, 1 - currentBreakpoint);
  };
  const onMove = (detail) => {
    if (!expandToScroll && cachedFooterYPosition !== null && currentFooterState !== null) {
      if (detail.currentY >= cachedFooterYPosition && currentFooterState === "moving") {
        swapFooterPosition("stationary");
      } else if (detail.currentY < cachedFooterYPosition && currentFooterState === "stationary") {
        swapFooterPosition("moving");
      }
    }
    if (!expandToScroll && detail.deltaY <= 0 && cachedScrollEl) {
      return;
    }
    if (detail.deltaY > 0 && contentEl) {
      contentEl.scrollY = false;
    }
    const initialStep = 1 - currentBreakpoint;
    const secondToLastBreakpoint = breakpoints.length > 1 ? 1 - breakpoints[1] : void 0;
    const step = initialStep + detail.deltaY / height;
    const isAttemptingDismissWithCanDismiss = secondToLastBreakpoint !== void 0 && step >= secondToLastBreakpoint && canDismissBlocksGesture;
    const maxStep = isAttemptingDismissWithCanDismiss ? canDismissMaxStep : 0.9999;
    const processedStep = isAttemptingDismissWithCanDismiss && secondToLastBreakpoint !== void 0 ? secondToLastBreakpoint + calculateSpringStep((step - secondToLastBreakpoint) / (maxStep - secondToLastBreakpoint)) : step;
    offset = clamp(1e-4, processedStep, maxStep);
    animation.progressStep(offset);
  };
  const onEnd = (detail) => {
    if (!expandToScroll && detail.deltaY <= 0 && cachedScrollEl && cachedScrollEl.scrollTop > 0) {
      swapFooterPosition("stationary");
      return;
    }
    const velocity = detail.velocityY;
    const threshold = (detail.deltaY + velocity * 350) / height;
    const diff = currentBreakpoint - threshold;
    const closest = breakpoints.reduce((a, b) => {
      return Math.abs(b - diff) < Math.abs(a - diff) ? b : a;
    });
    moveSheetToBreakpoint({
      breakpoint: closest,
      breakpointOffset: offset,
      canDismiss: canDismissBlocksGesture,
      /**
       * The swipe is user-driven, so we should
       * always animate when the gesture ends.
       */
      animated: true
    });
  };
  const moveSheetToBreakpoint = (options) => {
    const { breakpoint, canDismiss, breakpointOffset, animated } = options;
    const shouldPreventDismiss = canDismiss && breakpoint === 0;
    const snapToBreakpoint = shouldPreventDismiss ? currentBreakpoint : breakpoint;
    const shouldRemainOpen = snapToBreakpoint !== 0;
    currentBreakpoint = 0;
    if (wrapperAnimation && backdropAnimation) {
      wrapperAnimation.keyframes([
        { offset: 0, transform: `translateY(${breakpointOffset * 100}%)` },
        { offset: 1, transform: `translateY(${(1 - snapToBreakpoint) * 100}%)` }
      ]);
      backdropAnimation.keyframes([
        {
          offset: 0,
          opacity: `calc(var(--backdrop-opacity) * ${getBackdropValueForSheet(1 - breakpointOffset, backdropBreakpoint)})`
        },
        {
          offset: 1,
          opacity: `calc(var(--backdrop-opacity) * ${getBackdropValueForSheet(snapToBreakpoint, backdropBreakpoint)})`
        }
      ]);
      if (contentAnimation) {
        contentAnimation.keyframes([
          { offset: 0, maxHeight: `${(1 - breakpointOffset) * 100}%` },
          { offset: 1, maxHeight: `${snapToBreakpoint * 100}%` }
        ]);
      }
      animation.progressStep(0);
    }
    gesture.enable(false);
    if (shouldPreventDismiss) {
      handleCanDismiss(baseEl, animation);
    } else if (!shouldRemainOpen) {
      onDismiss();
    }
    if (contentEl && (snapToBreakpoint === breakpoints[breakpoints.length - 1] || !expandToScroll)) {
      contentEl.scrollY = true;
    }
    if (!expandToScroll && snapToBreakpoint === 0) {
      swapFooterPosition("stationary");
    }
    return new Promise((resolve) => {
      animation.onFinish(() => {
        if (shouldRemainOpen) {
          if (!expandToScroll) {
            swapFooterPosition("stationary");
          }
          if (wrapperAnimation && backdropAnimation) {
            raf(() => {
              wrapperAnimation.keyframes([...SheetDefaults.WRAPPER_KEYFRAMES]);
              backdropAnimation.keyframes([...SheetDefaults.BACKDROP_KEYFRAMES]);
              contentAnimation === null || contentAnimation === void 0 ? void 0 : contentAnimation.keyframes([...SheetDefaults.CONTENT_KEYFRAMES]);
              animation.progressStart(true, 1 - snapToBreakpoint);
              currentBreakpoint = snapToBreakpoint;
              onBreakpointChange(currentBreakpoint);
              const shouldEnableBackdrop = currentBreakpoint > backdropBreakpoint;
              if (shouldEnableBackdrop) {
                enableBackdrop();
              } else {
                disableBackdrop();
              }
              gesture.enable(true);
              resolve();
            });
          } else {
            gesture.enable(true);
            resolve();
          }
        } else {
          resolve();
        }
      }, { oneTimeCallback: true }).progressEnd(1, 0, animated ? 500 : 0);
    });
  };
  const gesture = createGesture({
    el: wrapperEl,
    gestureName: "modalSheet",
    gesturePriority: 40,
    direction: "y",
    threshold: 10,
    canStart,
    onStart,
    onMove,
    onEnd
  });
  return {
    gesture,
    moveSheetToBreakpoint
  };
};
var modalIosCss = ':host{--width:100%;--min-width:auto;--max-width:auto;--height:100%;--min-height:auto;--max-height:auto;--overflow:hidden;--border-radius:0;--border-width:0;--border-style:none;--border-color:transparent;--background:var(--ion-background-color, #fff);--box-shadow:none;--backdrop-opacity:0;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;outline:none;color:var(--ion-text-color, #000);contain:strict}.modal-wrapper,ion-backdrop{pointer-events:auto}:host(.overlay-hidden){display:none}.modal-wrapper,.modal-shadow{border-radius:var(--border-radius);width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow);overflow:var(--overflow);z-index:10}.modal-shadow{position:absolute;background:transparent}@media only screen and (min-width: 768px) and (min-height: 600px){:host{--width:600px;--height:500px;--ion-safe-area-top:0px;--ion-safe-area-bottom:0px;--ion-safe-area-right:0px;--ion-safe-area-left:0px}}@media only screen and (min-width: 768px) and (min-height: 768px){:host{--width:600px;--height:600px}}.modal-handle{left:0px;right:0px;top:5px;border-radius:8px;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto;position:absolute;width:36px;height:5px;-webkit-transform:translateZ(0);transform:translateZ(0);border:0;background:var(--ion-color-step-350, var(--ion-background-color-step-350, #c0c0be));cursor:pointer;z-index:11}.modal-handle::before{-webkit-padding-start:4px;padding-inline-start:4px;-webkit-padding-end:4px;padding-inline-end:4px;padding-top:4px;padding-bottom:4px;position:absolute;width:36px;height:5px;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%);content:""}:host(.modal-sheet){--height:calc(100% - (var(--ion-safe-area-top) + 10px))}:host(.modal-sheet) .modal-wrapper,:host(.modal-sheet) .modal-shadow{position:absolute;bottom:0}:host(.modal-sheet.modal-no-expand-scroll) ion-footer{position:absolute;bottom:0;width:var(--width)}:host{--backdrop-opacity:var(--ion-backdrop-opacity, 0.4)}:host(.modal-card),:host(.modal-sheet){--border-radius:10px}@media only screen and (min-width: 768px) and (min-height: 600px){:host{--border-radius:10px}}.modal-wrapper{-webkit-transform:translate3d(0,  100%,  0);transform:translate3d(0,  100%,  0)}@media screen and (max-width: 767px){@supports (width: max(0px, 1px)){:host(.modal-card){--height:calc(100% - max(30px, var(--ion-safe-area-top)) - 10px)}}@supports not (width: max(0px, 1px)){:host(.modal-card){--height:calc(100% - 40px)}}:host(.modal-card) .modal-wrapper{border-start-start-radius:var(--border-radius);border-start-end-radius:var(--border-radius);border-end-end-radius:0;border-end-start-radius:0}:host(.modal-card){--backdrop-opacity:0;--width:100%;-ms-flex-align:end;align-items:flex-end}:host(.modal-card) .modal-shadow{display:none}:host(.modal-card) ion-backdrop{pointer-events:none}}@media screen and (min-width: 768px){:host(.modal-card){--width:calc(100% - 120px);--height:calc(100% - (120px + var(--ion-safe-area-top) + var(--ion-safe-area-bottom)));--max-width:720px;--max-height:1000px;--backdrop-opacity:0;--box-shadow:0px 0px 30px 10px rgba(0, 0, 0, 0.1);-webkit-transition:all 0.5s ease-in-out;transition:all 0.5s ease-in-out}:host(.modal-card) .modal-wrapper{-webkit-box-shadow:none;box-shadow:none}:host(.modal-card) .modal-shadow{-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow)}}:host(.modal-sheet) .modal-wrapper{border-start-start-radius:var(--border-radius);border-start-end-radius:var(--border-radius);border-end-end-radius:0;border-end-start-radius:0}';
var modalMdCss = ':host{--width:100%;--min-width:auto;--max-width:auto;--height:100%;--min-height:auto;--max-height:auto;--overflow:hidden;--border-radius:0;--border-width:0;--border-style:none;--border-color:transparent;--background:var(--ion-background-color, #fff);--box-shadow:none;--backdrop-opacity:0;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;outline:none;color:var(--ion-text-color, #000);contain:strict}.modal-wrapper,ion-backdrop{pointer-events:auto}:host(.overlay-hidden){display:none}.modal-wrapper,.modal-shadow{border-radius:var(--border-radius);width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow);overflow:var(--overflow);z-index:10}.modal-shadow{position:absolute;background:transparent}@media only screen and (min-width: 768px) and (min-height: 600px){:host{--width:600px;--height:500px;--ion-safe-area-top:0px;--ion-safe-area-bottom:0px;--ion-safe-area-right:0px;--ion-safe-area-left:0px}}@media only screen and (min-width: 768px) and (min-height: 768px){:host{--width:600px;--height:600px}}.modal-handle{left:0px;right:0px;top:5px;border-radius:8px;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto;position:absolute;width:36px;height:5px;-webkit-transform:translateZ(0);transform:translateZ(0);border:0;background:var(--ion-color-step-350, var(--ion-background-color-step-350, #c0c0be));cursor:pointer;z-index:11}.modal-handle::before{-webkit-padding-start:4px;padding-inline-start:4px;-webkit-padding-end:4px;padding-inline-end:4px;padding-top:4px;padding-bottom:4px;position:absolute;width:36px;height:5px;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%);content:""}:host(.modal-sheet){--height:calc(100% - (var(--ion-safe-area-top) + 10px))}:host(.modal-sheet) .modal-wrapper,:host(.modal-sheet) .modal-shadow{position:absolute;bottom:0}:host(.modal-sheet.modal-no-expand-scroll) ion-footer{position:absolute;bottom:0;width:var(--width)}:host{--backdrop-opacity:var(--ion-backdrop-opacity, 0.32)}@media only screen and (min-width: 768px) and (min-height: 600px){:host{--border-radius:2px;--box-shadow:0 28px 48px rgba(0, 0, 0, 0.4)}}.modal-wrapper{-webkit-transform:translate3d(0,  40px,  0);transform:translate3d(0,  40px,  0);opacity:0.01}';
var Modal = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.didPresent = createEvent(this, "ionModalDidPresent", 7);
    this.willPresent = createEvent(this, "ionModalWillPresent", 7);
    this.willDismiss = createEvent(this, "ionModalWillDismiss", 7);
    this.didDismiss = createEvent(this, "ionModalDidDismiss", 7);
    this.ionBreakpointDidChange = createEvent(this, "ionBreakpointDidChange", 7);
    this.didPresentShorthand = createEvent(this, "didPresent", 7);
    this.willPresentShorthand = createEvent(this, "willPresent", 7);
    this.willDismissShorthand = createEvent(this, "willDismiss", 7);
    this.didDismissShorthand = createEvent(this, "didDismiss", 7);
    this.ionMount = createEvent(this, "ionMount", 7);
    this.lockController = createLockController();
    this.triggerController = createTriggerController();
    this.coreDelegate = CoreDelegate();
    this.isSheetModal = false;
    this.inheritedAttributes = {};
    this.inline = false;
    this.gestureAnimationDismissing = false;
    this.presented = false;
    this.hasController = false;
    this.keyboardClose = true;
    this.expandToScroll = true;
    this.backdropBreakpoint = 0;
    this.handleBehavior = "none";
    this.backdropDismiss = true;
    this.showBackdrop = true;
    this.animated = true;
    this.isOpen = false;
    this.keepContentsMounted = false;
    this.focusTrap = true;
    this.canDismiss = true;
    this.onHandleClick = () => {
      const { sheetTransition, handleBehavior } = this;
      if (handleBehavior !== "cycle" || sheetTransition !== void 0) {
        return;
      }
      this.moveToNextBreakpoint();
    };
    this.onBackdropTap = () => {
      const { sheetTransition } = this;
      if (sheetTransition !== void 0) {
        return;
      }
      this.dismiss(void 0, BACKDROP);
    };
    this.onLifecycle = (modalEvent) => {
      const el = this.usersElement;
      const name = LIFECYCLE_MAP[modalEvent.type];
      if (el && name) {
        const ev = new CustomEvent(name, {
          bubbles: false,
          cancelable: false,
          detail: modalEvent.detail
        });
        el.dispatchEvent(ev);
      }
    };
    this.onModalFocus = (ev) => {
      const { dragHandleEl, el } = this;
      if (ev.target === el && dragHandleEl && dragHandleEl.tabIndex !== -1) {
        dragHandleEl.focus();
      }
    };
    this.onSlotChange = ({ target }) => {
      const slot = target;
      slot.assignedElements().forEach((el) => {
        el.querySelectorAll("ion-modal").forEach((childModal) => {
          if (childModal.getAttribute("data-parent-ion-modal") === null) {
            childModal.setAttribute("data-parent-ion-modal", this.el.id);
          }
        });
      });
    };
  }
  onIsOpenChange(newValue, oldValue) {
    if (newValue === true && oldValue === false) {
      this.present();
    } else if (newValue === false && oldValue === true) {
      this.dismiss();
    }
  }
  triggerChanged() {
    const { trigger, el, triggerController } = this;
    if (trigger) {
      triggerController.addClickListener(el, trigger);
    }
  }
  onWindowResize() {
    if (getIonMode(this) !== "ios" || !this.presentingElement || this.enterAnimation || this.leaveAnimation) {
      return;
    }
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.handleViewTransition();
    }, 50);
  }
  breakpointsChanged(breakpoints) {
    if (breakpoints !== void 0) {
      this.sortedBreakpoints = breakpoints.sort((a, b) => a - b);
    }
  }
  connectedCallback() {
    const { el } = this;
    prepareOverlay(el);
    this.triggerChanged();
  }
  disconnectedCallback() {
    this.triggerController.removeClickListener();
    this.cleanupViewTransitionListener();
    this.cleanupParentRemovalObserver();
  }
  componentWillLoad() {
    var _a;
    const { breakpoints, initialBreakpoint, el, htmlAttributes } = this;
    const isSheetModal = this.isSheetModal = breakpoints !== void 0 && initialBreakpoint !== void 0;
    const attributesToInherit = ["aria-label", "role"];
    this.inheritedAttributes = inheritAttributes(el, attributesToInherit);
    if (el.parentNode) {
      this.cachedOriginalParent = el.parentNode;
    }
    if (htmlAttributes !== void 0) {
      attributesToInherit.forEach((attribute) => {
        const attributeValue = htmlAttributes[attribute];
        if (attributeValue) {
          this.inheritedAttributes = Object.assign(Object.assign({}, this.inheritedAttributes), { [attribute]: htmlAttributes[attribute] });
          delete htmlAttributes[attribute];
        }
      });
    }
    if (isSheetModal) {
      this.currentBreakpoint = this.initialBreakpoint;
    }
    if (breakpoints !== void 0 && initialBreakpoint !== void 0 && !breakpoints.includes(initialBreakpoint)) {
      printIonWarning("[ion-modal] - Your breakpoints array must include the initialBreakpoint value.");
    }
    if (!((_a = this.htmlAttributes) === null || _a === void 0 ? void 0 : _a.id)) {
      setOverlayId(this.el);
    }
  }
  componentDidLoad() {
    if (this.isOpen === true) {
      raf(() => this.present());
    }
    this.breakpointsChanged(this.breakpoints);
    this.triggerChanged();
  }
  /**
   * Determines whether or not an overlay
   * is being used inline or via a controller/JS
   * and returns the correct delegate.
   * By default, subsequent calls to getDelegate
   * will use a cached version of the delegate.
   * This is useful for calling dismiss after
   * present so that the correct delegate is given.
   */
  getDelegate(force = false) {
    if (this.workingDelegate && !force) {
      return {
        delegate: this.workingDelegate,
        inline: this.inline
      };
    }
    const parentEl = this.el.parentNode;
    const inline = this.inline = parentEl !== null && !this.hasController;
    const delegate = this.workingDelegate = inline ? this.delegate || this.coreDelegate : this.delegate;
    return { inline, delegate };
  }
  /**
   * Determines whether or not the
   * modal is allowed to dismiss based
   * on the state of the canDismiss prop.
   */
  checkCanDismiss(data, role) {
    return __async(this, null, function* () {
      const { canDismiss } = this;
      if (typeof canDismiss === "function") {
        return canDismiss(data, role);
      }
      return canDismiss;
    });
  }
  /**
   * Present the modal overlay after it has been created.
   */
  present() {
    return __async(this, null, function* () {
      const unlock = yield this.lockController.lock();
      if (this.presented) {
        unlock();
        return;
      }
      const { presentingElement, el } = this;
      this.currentBreakpoint = this.initialBreakpoint;
      const { inline, delegate } = this.getDelegate(true);
      this.ionMount.emit();
      this.usersElement = yield attachComponent(delegate, el, this.component, ["ion-page"], this.componentProps, inline);
      if (hasLazyBuild(el)) {
        yield deepReady(this.usersElement);
      } else if (!this.keepContentsMounted) {
        yield waitForMount();
      }
      writeTask(() => this.el.classList.add("show-modal"));
      const hasCardModal = presentingElement !== void 0;
      if (hasCardModal && getIonMode(this) === "ios") {
        this.statusBarStyle = yield StatusBar.getStyle();
        setCardStatusBarDark();
      }
      yield present(this, "modalEnter", iosEnterAnimation, mdEnterAnimation, {
        presentingEl: presentingElement,
        currentBreakpoint: this.initialBreakpoint,
        backdropBreakpoint: this.backdropBreakpoint,
        expandToScroll: this.expandToScroll
      });
      if (typeof window !== "undefined") {
        this.keyboardOpenCallback = () => {
          if (this.gesture) {
            this.gesture.enable(false);
            raf(() => {
              if (this.gesture) {
                this.gesture.enable(true);
              }
            });
          }
        };
        window.addEventListener(KEYBOARD_DID_OPEN, this.keyboardOpenCallback);
      }
      if (this.isSheetModal) {
        this.initSheetGesture();
      } else if (hasCardModal) {
        this.initSwipeToClose();
      }
      this.initViewTransitionListener();
      this.initParentRemovalObserver();
      unlock();
    });
  }
  initSwipeToClose() {
    var _a;
    if (getIonMode(this) !== "ios") {
      return;
    }
    const { el } = this;
    const animationBuilder = this.leaveAnimation || config.get("modalLeave", iosLeaveAnimation);
    const ani = this.animation = animationBuilder(el, {
      presentingEl: this.presentingElement,
      expandToScroll: this.expandToScroll
    });
    const contentEl = findIonContent(el);
    if (!contentEl) {
      printIonContentErrorMsg(el);
      return;
    }
    const statusBarStyle = (_a = this.statusBarStyle) !== null && _a !== void 0 ? _a : Style.Default;
    this.gesture = createSwipeToCloseGesture(el, ani, statusBarStyle, () => {
      this.gestureAnimationDismissing = true;
      setCardStatusBarDefault(this.statusBarStyle);
      this.animation.onFinish(() => __async(this, null, function* () {
        yield this.dismiss(void 0, GESTURE);
        this.gestureAnimationDismissing = false;
      }));
    });
    this.gesture.enable(true);
  }
  initSheetGesture() {
    const { wrapperEl, initialBreakpoint, backdropBreakpoint } = this;
    if (!wrapperEl || initialBreakpoint === void 0) {
      return;
    }
    const animationBuilder = this.enterAnimation || config.get("modalEnter", iosEnterAnimation);
    const ani = this.animation = animationBuilder(this.el, {
      presentingEl: this.presentingElement,
      currentBreakpoint: initialBreakpoint,
      backdropBreakpoint,
      expandToScroll: this.expandToScroll
    });
    ani.progressStart(true, 1);
    const { gesture, moveSheetToBreakpoint } = createSheetGesture(this.el, this.backdropEl, wrapperEl, initialBreakpoint, backdropBreakpoint, ani, this.sortedBreakpoints, this.expandToScroll, () => {
      var _a;
      return (_a = this.currentBreakpoint) !== null && _a !== void 0 ? _a : 0;
    }, () => this.sheetOnDismiss(), (breakpoint) => {
      if (this.currentBreakpoint !== breakpoint) {
        this.currentBreakpoint = breakpoint;
        this.ionBreakpointDidChange.emit({ breakpoint });
      }
    });
    this.gesture = gesture;
    this.moveSheetToBreakpoint = moveSheetToBreakpoint;
    this.gesture.enable(true);
  }
  sheetOnDismiss() {
    this.gestureAnimationDismissing = true;
    this.animation.onFinish(() => __async(this, null, function* () {
      this.currentBreakpoint = 0;
      this.ionBreakpointDidChange.emit({ breakpoint: this.currentBreakpoint });
      yield this.dismiss(void 0, GESTURE);
      this.gestureAnimationDismissing = false;
    }));
  }
  /**
   * Dismiss the modal overlay after it has been presented.
   * This is a no-op if the overlay has not been presented yet. If you want
   * to remove an overlay from the DOM that was never presented, use the
   * [remove](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) method.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the modal.
   * For example, `cancel` or `backdrop`.
   */
  dismiss(data, role) {
    return __async(this, null, function* () {
      var _a;
      if (this.gestureAnimationDismissing && role !== GESTURE) {
        return false;
      }
      const unlock = yield this.lockController.lock();
      yield this.dismissNestedModals();
      if (role !== "handler" && !(yield this.checkCanDismiss(data, role))) {
        unlock();
        return false;
      }
      const { presentingElement } = this;
      const hasCardModal = presentingElement !== void 0;
      if (hasCardModal && getIonMode(this) === "ios") {
        setCardStatusBarDefault(this.statusBarStyle);
      }
      if (typeof window !== "undefined" && this.keyboardOpenCallback) {
        window.removeEventListener(KEYBOARD_DID_OPEN, this.keyboardOpenCallback);
        this.keyboardOpenCallback = void 0;
      }
      const dismissed = yield dismiss(this, data, role, "modalLeave", iosLeaveAnimation, mdLeaveAnimation, {
        presentingEl: presentingElement,
        currentBreakpoint: (_a = this.currentBreakpoint) !== null && _a !== void 0 ? _a : this.initialBreakpoint,
        backdropBreakpoint: this.backdropBreakpoint,
        expandToScroll: this.expandToScroll
      });
      if (dismissed) {
        const { delegate } = this.getDelegate();
        yield detachComponent(delegate, this.usersElement);
        writeTask(() => this.el.classList.remove("show-modal"));
        if (this.animation) {
          this.animation.destroy();
        }
        if (this.gesture) {
          this.gesture.destroy();
        }
        this.cleanupViewTransitionListener();
        this.cleanupParentRemovalObserver();
      }
      this.currentBreakpoint = void 0;
      this.animation = void 0;
      unlock();
      return dismissed;
    });
  }
  /**
   * Returns a promise that resolves when the modal did dismiss.
   */
  onDidDismiss() {
    return eventMethod(this.el, "ionModalDidDismiss");
  }
  /**
   * Returns a promise that resolves when the modal will dismiss.
   */
  onWillDismiss() {
    return eventMethod(this.el, "ionModalWillDismiss");
  }
  /**
   * Move a sheet style modal to a specific breakpoint.
   *
   * @param breakpoint The breakpoint value to move the sheet modal to.
   * Must be a value defined in your `breakpoints` array.
   */
  setCurrentBreakpoint(breakpoint) {
    return __async(this, null, function* () {
      if (!this.isSheetModal) {
        printIonWarning("[ion-modal] - setCurrentBreakpoint is only supported on sheet modals.");
        return;
      }
      if (!this.breakpoints.includes(breakpoint)) {
        printIonWarning(`[ion-modal] - Attempted to set invalid breakpoint value ${breakpoint}. Please double check that the breakpoint value is part of your defined breakpoints.`);
        return;
      }
      const { currentBreakpoint, moveSheetToBreakpoint, canDismiss, breakpoints, animated } = this;
      if (currentBreakpoint === breakpoint) {
        return;
      }
      if (moveSheetToBreakpoint) {
        this.sheetTransition = moveSheetToBreakpoint({
          breakpoint,
          breakpointOffset: 1 - currentBreakpoint,
          canDismiss: canDismiss !== void 0 && canDismiss !== true && breakpoints[0] === 0,
          animated
        });
        yield this.sheetTransition;
        this.sheetTransition = void 0;
      }
    });
  }
  /**
   * Returns the current breakpoint of a sheet style modal
   */
  getCurrentBreakpoint() {
    return __async(this, null, function* () {
      return this.currentBreakpoint;
    });
  }
  moveToNextBreakpoint() {
    return __async(this, null, function* () {
      const { breakpoints, currentBreakpoint } = this;
      if (!breakpoints || currentBreakpoint == null) {
        return false;
      }
      const allowedBreakpoints = breakpoints.filter((b) => b !== 0);
      const currentBreakpointIndex = allowedBreakpoints.indexOf(currentBreakpoint);
      const nextBreakpointIndex = (currentBreakpointIndex + 1) % allowedBreakpoints.length;
      const nextBreakpoint = allowedBreakpoints[nextBreakpointIndex];
      yield this.setCurrentBreakpoint(nextBreakpoint);
      return true;
    });
  }
  initViewTransitionListener() {
    if (getIonMode(this) !== "ios" || !this.presentingElement || this.enterAnimation || this.leaveAnimation) {
      return;
    }
    this.currentViewIsPortrait = window.innerWidth < 768;
  }
  handleViewTransition() {
    const isPortrait = window.innerWidth < 768;
    if (this.currentViewIsPortrait === isPortrait) {
      return;
    }
    if (this.viewTransitionAnimation) {
      this.viewTransitionAnimation.destroy();
      this.viewTransitionAnimation = void 0;
    }
    const { presentingElement } = this;
    if (!presentingElement) {
      return;
    }
    let transitionAnimation;
    if (this.currentViewIsPortrait && !isPortrait) {
      transitionAnimation = portraitToLandscapeTransition(this.el, {
        presentingEl: presentingElement
      });
    } else {
      transitionAnimation = landscapeToPortraitTransition(this.el, {
        presentingEl: presentingElement
      });
    }
    this.currentViewIsPortrait = isPortrait;
    this.viewTransitionAnimation = transitionAnimation;
    transitionAnimation.play().then(() => {
      this.viewTransitionAnimation = void 0;
      this.reinitSwipeToClose();
    });
  }
  cleanupViewTransitionListener() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = void 0;
    }
    if (this.viewTransitionAnimation) {
      this.viewTransitionAnimation.destroy();
      this.viewTransitionAnimation = void 0;
    }
  }
  reinitSwipeToClose() {
    if (getIonMode(this) !== "ios" || !this.presentingElement) {
      return;
    }
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = void 0;
    }
    if (this.animation) {
      this.animation.progressEnd(0, 0, 0);
      this.animation.destroy();
      this.animation = void 0;
    }
    raf(() => {
      this.ensureCorrectModalPosition();
      this.initSwipeToClose();
    });
  }
  ensureCorrectModalPosition() {
    const { el, presentingElement } = this;
    const root = getElementRoot(el);
    const wrapperEl = root.querySelector(".modal-wrapper");
    if (wrapperEl) {
      wrapperEl.style.transform = "translateY(0vh)";
      wrapperEl.style.opacity = "1";
    }
    if ((presentingElement === null || presentingElement === void 0 ? void 0 : presentingElement.tagName) === "ION-MODAL") {
      const isPortrait = window.innerWidth < 768;
      if (isPortrait) {
        const transformOffset = !CSS.supports("width", "max(0px, 1px)") ? "30px" : "max(30px, var(--ion-safe-area-top))";
        const scale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
        presentingElement.style.transform = `translateY(${transformOffset}) scale(${scale})`;
      } else {
        presentingElement.style.transform = "translateY(0px) scale(1)";
      }
    }
  }
  dismissNestedModals() {
    return __async(this, null, function* () {
      const nestedModals = document.querySelectorAll(`ion-modal[data-parent-ion-modal="${this.el.id}"]`);
      nestedModals === null || nestedModals === void 0 ? void 0 : nestedModals.forEach((modal) => __async(this, null, function* () {
        yield modal.dismiss(void 0, "parent-dismissed");
      }));
    });
  }
  initParentRemovalObserver() {
    if (typeof MutationObserver === "undefined") {
      return;
    }
    if (typeof window === "undefined" || !this.cachedOriginalParent) {
      return;
    }
    if (this.cachedOriginalParent.nodeType === Node.DOCUMENT_NODE || this.cachedOriginalParent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      return;
    }
    this.parentRemovalObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
          const cachedParentWasRemoved = Array.from(mutation.removedNodes).some((node) => {
            var _a, _b;
            const isDirectMatch = node === this.cachedOriginalParent;
            const isContainedMatch = this.cachedOriginalParent ? (_b = (_a = node).contains) === null || _b === void 0 ? void 0 : _b.call(_a, this.cachedOriginalParent) : false;
            return isDirectMatch || isContainedMatch;
          });
          const cachedParentDisconnected = this.cachedOriginalParent && !this.cachedOriginalParent.isConnected;
          if (cachedParentWasRemoved || cachedParentDisconnected) {
            this.dismiss(void 0, "parent-removed");
            this.cachedOriginalParent = void 0;
          }
        }
      });
    });
    this.parentRemovalObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  cleanupParentRemovalObserver() {
    var _a;
    (_a = this.parentRemovalObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
    this.parentRemovalObserver = void 0;
  }
  render() {
    const { handle, isSheetModal, presentingElement, htmlAttributes, handleBehavior, inheritedAttributes, focusTrap, expandToScroll } = this;
    const showHandle = handle !== false && isSheetModal;
    const mode = getIonMode(this);
    const isCardModal = presentingElement !== void 0 && mode === "ios";
    const isHandleCycle = handleBehavior === "cycle";
    const isSheetModalWithHandle = isSheetModal && showHandle;
    return h(Host, Object.assign({
      key: "9e9a7bd591eb17a225a00b4fa2e379e94601d17f",
      "no-router": true,
      // Allow the modal to be navigable when the handle is focusable
      tabIndex: isHandleCycle && isSheetModalWithHandle ? 0 : -1
    }, htmlAttributes, { style: {
      zIndex: `${2e4 + this.overlayIndex}`
    }, class: Object.assign({ [mode]: true, ["modal-default"]: !isCardModal && !isSheetModal, [`modal-card`]: isCardModal, [`modal-sheet`]: isSheetModal, [`modal-no-expand-scroll`]: isSheetModal && !expandToScroll, "overlay-hidden": true, [FOCUS_TRAP_DISABLE_CLASS]: focusTrap === false }, getClassMap(this.cssClass)), onIonBackdropTap: this.onBackdropTap, onIonModalDidPresent: this.onLifecycle, onIonModalWillPresent: this.onLifecycle, onIonModalWillDismiss: this.onLifecycle, onIonModalDidDismiss: this.onLifecycle, onFocus: this.onModalFocus }), h("ion-backdrop", { key: "e5eae2c14f830f75e308fcd7f4c10c86fac5b962", ref: (el) => this.backdropEl = el, visible: this.showBackdrop, tappable: this.backdropDismiss, part: "backdrop" }), mode === "ios" && h("div", { key: "e268f9cd310c3cf4e051b5b92524ce4fb70d005e", class: "modal-shadow" }), h("div", Object.assign({
      key: "9c380f36c18144c153077b15744d1c3346bce63e",
      /*
        role and aria-modal must be used on the
        same element. They must also be set inside the
        shadow DOM otherwise ion-button will not be highlighted
        when using VoiceOver: https://bugs.webkit.org/show_bug.cgi?id=247134
      */
      role: "dialog"
    }, inheritedAttributes, { "aria-modal": "true", class: "modal-wrapper ion-overlay-wrapper", part: "content", ref: (el) => this.wrapperEl = el }), showHandle && h("button", {
      key: "2d5ee6d5959d97309c306e8ce72eb0f2c19be144",
      class: "modal-handle",
      // Prevents the handle from receiving keyboard focus when it does not cycle
      tabIndex: !isHandleCycle ? -1 : 0,
      "aria-label": "Activate to adjust the size of the dialog overlaying the screen",
      onClick: isHandleCycle ? this.onHandleClick : void 0,
      part: "handle",
      ref: (el) => this.dragHandleEl = el
    }), h("slot", { key: "5590434c35ea04c42fc006498bc189038e15a298", onSlotchange: this.onSlotChange })));
  }
  get el() {
    return getElement(this);
  }
  static get watchers() {
    return {
      "isOpen": ["onIsOpenChange"],
      "trigger": ["triggerChanged"]
    };
  }
};
var LIFECYCLE_MAP = {
  ionModalDidPresent: "ionViewDidEnter",
  ionModalWillPresent: "ionViewWillEnter",
  ionModalWillDismiss: "ionViewWillLeave",
  ionModalDidDismiss: "ionViewDidLeave"
};
Modal.style = {
  ios: modalIosCss,
  md: modalMdCss
};
export {
  Modal as ion_modal
};
/*! Bundled license information:

@ionic/core/dist/esm/ion-modal.entry.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
//# sourceMappingURL=ion-modal.entry-X3MZ5N4N.js.map
