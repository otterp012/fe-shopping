function selector(query, start = document.body) {
  return start.querySelector(`${query}`);
}

async function myFetch(url) {
  const data = await fetch(url);
  return data.json();
}
export { selector, myFetch };
