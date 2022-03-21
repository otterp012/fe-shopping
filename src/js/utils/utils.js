function selector(query, start = document.body) {
  return start.querySelector(`${query}`);
}

async function myFetch(url) {
  const data = await fetch(url);
  return data.json();
}

function debounce(func, timeout) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export { selector, myFetch, debounce };
