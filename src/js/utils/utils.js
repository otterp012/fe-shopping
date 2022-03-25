const selector = (query, start = document.body) => {
  return start.querySelector(`${query}`);
};

const hasTargetParent = (node, target) => {
  if (node) {
    let current = node;
    while (true) {
      let parent = current.parentNode;
      current = parent;
      if (parent === document.body) return false;
      if (parent === target) return true;
    }
  }
};

const hasValue = (node) => {
  return !!node.value;
};

const addClassName = (node, className) => {
  node.classList.add(className);
};

const removeClassName = (node, className) => {
  if (node.classList.contains(className)) {
    node.classList.remove(className);
  }
};

const myFetch = async (url) => {
  const data = await fetch(url);
  return data.json();
};

const debounce = (func, timeout) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export {
  selector,
  hasTargetParent,
  hasValue,
  addClassName,
  removeClassName,
  myFetch,
  debounce,
};
