export const $ = (selected) => document.body.querySelector(selected);

export const $$ = (selected) => document.body.querySelectorAll(selected);

export async function fetchData(url) {
  const successData = await fetch(url);
  const json = await successData.json();
  return json;
}

export async function getCompleteData(consonant) {
  const jsonData = await fetchData('/completeData');
  const completeData = jsonData[`${consonant}data`];
  return completeData;
}

export function makeImageSlide(list) {
  return `
  <li id= "${list.id}" class="image-element">
    <img src="${list.imgURL}" / alt="${list.imgTitle} 이미지" width = "950" height = "400">
    </li>
  `;
}

export function makeSideTab(list) {
  return `
  <li id= "${list.id}" class="side-tab-element">
    <img src="${list.subImgURL}" / alt="${list.imgTitle} 이미지" width = "200" height = "55">
    </li>
  `;
}

export function makeShoppingCategory(categoryData, step) {
  return [...categoryData].reduce(
    (pre, curContent) =>
      (pre += `<li class = "shopping-popup-menu-item">${curContent[`${step}`]}</li>`),
    ''
  );
}

export function throttle(callback, wait) {
  let waiting = true;
  return function (...args) {
    if (waiting) {
      callback.apply(this, args);
      waiting = false;
      setTimeout(() => {
        waiting = true;
      }, wait);
    }
  };
}

export function debounce(callback, wait) {
  let waiting;
  return function (...args) {
    clearTimeout(waiting);
    waiting = setTimeout(() => {
      callback.apply(this, args);
    }, wait);
  };
}
