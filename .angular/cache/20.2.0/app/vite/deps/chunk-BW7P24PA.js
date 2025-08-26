// node_modules/@ionic/core/dist/esm/watch-options-Dtdm8lKC.js
var watchForOptions = (containerEl, tagName, onChange) => {
  if (typeof MutationObserver === "undefined") {
    return;
  }
  const mutation = new MutationObserver((mutationList) => {
    onChange(getSelectedOption(mutationList, tagName));
  });
  mutation.observe(containerEl, {
    childList: true,
    subtree: true
  });
  return mutation;
};
var getSelectedOption = (mutationList, tagName) => {
  let newOption;
  mutationList.forEach((mut) => {
    for (let i = 0; i < mut.addedNodes.length; i++) {
      newOption = findCheckedOption(mut.addedNodes[i], tagName) || newOption;
    }
  });
  return newOption;
};
var findCheckedOption = (node, tagName) => {
  if (node.nodeType !== 1) {
    return void 0;
  }
  const el = node;
  const options = el.tagName === tagName.toUpperCase() ? [el] : Array.from(el.querySelectorAll(tagName));
  return options.find((o) => o.value === el.value);
};

export {
  watchForOptions
};
/*! Bundled license information:

@ionic/core/dist/esm/watch-options-Dtdm8lKC.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
//# sourceMappingURL=chunk-BW7P24PA.js.map
