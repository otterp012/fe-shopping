import {
  SearchHistoryGenerator,
  SearchAutoGenerator,
} from './search/Searcher.js';
import { utils } from './utils.js';

function init() {
  const searchHistory = new SearchHistoryGenerator();
  const searchAuto = new SearchAutoGenerator();
}

init();

// 아래 부분은 카테고리 이벤트 부분입니다.
// 클래스로, 설계는 해놓았는데 아직 코드를 짜지 못했습니다. 🥲
// 주말에 마무리 할 계획입니다!

const selectOptionListsWrapperEl = document.querySelector(
  '.select-option-lists'
);
async function renderFilterOptions() {
  const filterOptionsJson = await utils.myFetch('/categoryData');
  const filterOptions = filterOptionsJson.reduce((acc, str) => {
    return acc + `<li class="select-option-list">${str}</li>`;
  }, '');

  selectOptionListsWrapperEl.innerHTML += filterOptions;
}
renderFilterOptions();
selectBtnClickEvent();

function selectBtnClickEvent() {
  document.querySelector('.select-btn').addEventListener('click', () => {
    selectOptionListsWrapperEl.classList.toggle('active');
  });
}

const selectBtnTextEl = document.querySelector('.select-btn-text');

selectOptionListsWrapperEl.addEventListener('click', (e) => {
  selectBtnTextEl.textContent = e.target.textContent;
  selectOptionListsWrapperEl.classList.remove('active');
});
