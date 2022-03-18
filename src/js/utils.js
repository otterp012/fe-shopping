const utils = {
  $(node) {
    return document.querySelector(`${node}`);
  },

  async myFetch(url) {
    const fetchData = await fetch(url);
    return fetchData.json();
  },
};

export { utils };
