const utils = {
  $(node) {
    return document.querySelector(`${node}`);
  },

  myFetch(url) {
    return fetch(`'${url}'`).then((res) => res.json);
  },

  templateReduce(array, template) {},
};

export { utils };
