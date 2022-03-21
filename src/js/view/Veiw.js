const View = {
  hasValue: (node) => {
    return !!node.value;
  },

  show: (node) => {
    node.style.display = 'block';
  },

  hide: (node) => {
    node.style.display = 'none';
  },

  isDisplayed: (node) => {
    return node.style.display === 'none' ? false : true;
  },

  timer: (callback, ms) => {
    setTimeout(() => callback(), ms);
  },

  addEvent: (node, type, eventHandler) => {
    node.addEventListener(`${type}`, (event) => {
      eventHandler(event);
    });
  },

  addClassName: (node, className) => {
    node.classList.add(className);
  },

  removeClassName: (node, className) => {
    if (node.classList.contains(className)) {
      node.classList.remove(className);
    }
  },

  hasTargetParent: (node, target) => {
    if (node) {
      let current = node;
      while (true) {
        let parent = current.parentNode;
        current = parent;
        if (parent === document.body) return false;
        if (parent === target) return true;
      }
    }
  },
};

export { View };
