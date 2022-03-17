import { utils } from './utils.js';

function selectBtnEventHandler() {
  document.querySelector('.select-btn').addEventListener('click', () => {
    document.querySelector('.select-options').classList.toggle('active');
  });
}

async function renderFilterOptions() {
  const filterOptionsJson = await utils.myFetch('/categoryData');
  const filterOptions = filterOptionsJson.reduce((acc, str) => {
    return acc + `<li class="select-option">${str}</li>`;
  }, '');

  document.querySelector('.select-options').innerHTML += filterOptions;
}

renderFilterOptions();
selectBtnEventHandler();

const autoSearchWordsEL = document.querySelector('.auto-search-words');
// const timer = setInterval(() => {
//   if (document.querySelector('.search-bar').value) {
//     if (!autoSearchWordsEL.classList.contains('active')) {
//       autoSearchWordsEL.classList.add('active');
//     }
//   } else {
//     if (autoSearchWordsEL.classList.contains('active'))
//       autoSearchWordsEL.classList.remove('active');
//   }
// }, 500);

// document.querySelector('.search-bar').addEventListener('keyup', () => {
//   renderSuggestions(document.querySelector('.search-bar').value);
// });

function getSuggestions(prefix) {
  return fetch(
    `https://completion.amazon.com/api/2017/suggestions?session-id=133-4736477-7395454&customer-id=&request-id=4YM3EXKRH1QJB16MSJGT&page-type=Gateway&lop=en_US&site-variant=desktop&client-info=amazon-search-ui&mid=ATVPDKIKX0DER&alias=aps&b2b=0&fresh=0&ks=8&prefix=${prefix}&event=onKeyPress&limit=11&fb=1&suggestion-type=KEYWORD`
  ).then((res) => res.json());
}

async function renderSuggestions(prefix) {
  const suggestionsJson = await getSuggestions(prefix);
  const suggestionsInfo = suggestionsJson.suggestions
    .map((suggestion) => suggestion.value)
    .reduce((acc, str) => {
      return acc + `<li class="auto-search-word">${str}</li>`;
    }, '');
  document.querySelector('.auto-search-words').innerHTML = '';
  document.querySelector('.auto-search-words').innerHTML += suggestionsInfo;
}

localStorage.setItem('key', 'value');
console.log(localStorage.getItem('key'))
console.log(window.localStrage);

document.querySelector('.search-bar').addEventListener(('submit'), () => {
  console.log(autoSearchWordsEL.vlaue)
})