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
const timer = setInterval(() => {
  if (document.querySelector('.search-bar').value) {
    if (!autoSearchWordsEL.classList.contains('active')) {
      autoSearchWordsEL.classList.add('active');
    }
  } else {
    if (autoSearchWordsEL.classList.contains('active'))
      autoSearchWordsEL.classList.remove('active');
  }
}, 500);

document.querySelector('.search-bar').addEventListener('keyup', () => {
  renderSuggestions(document.querySelector('.search-bar').value);
});

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

class Searcher {
  constructor() {}

  render() {
    throw 'override!';
  }

  hasValue(selector) {
    if (body.querySelector(`${selector}`)) return true;
    return false;
  }

  show(selector) {
    body.querySelector(`${selector}`).style.display = 'block';
  }

  hide(selector) {
    body.querySelector(`${selector}`).style.display = 'none';
  }

  removeHtml(selector) {
    body.querySelector(`${selector}`).innerHTML = '';
  }

  addHtml(selector, html) {
    body.querySelector(`${selector}`).innerHTML = html;
  }

  timer(callback, ms) {
    setTimeout(() => callback(), ms);
  }
}

class SearchHistoryGenerator extends Searcher {
  constructor(localStorage) {
    this.searchHistoryArr = [];
    this.localStorage = localStorage;
  }

  init() {}

  template(str) {
    `<li class="history-search-word"><a href="#">${str}</a>
    <button class="history-delete-btn">삭제</button>
  </li>`;
  }

  displaySearchHistory() {}
}

const t = document.querySelector('.search-bar');
const s = document.querySelector('.history-search-words');
let searchHistoryArr = [];
// t.addEventListener('keypress', ({ keyCode }) => {
//   if (keyCode === 13) {
//     if (searchHistoryArr.length > 10) searchHistoryArr.shift();
//     searchHistoryArr.push(t.value);
//     localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArr));
//     t.value = '';
//     const view = JSON.parse(localStorage.getItem('searchHistory')).reduce(
//       (acc, info) => {
//         return (
//           acc +
//           `<li class="history-search-word"><a href="#">${info}</a>
//           <button class="history-delete-btn">삭제</button>
//         </li>`
//         );
//       },
//       ''
//     );
//     s.innerHTML = '';
//     s.innerHTML += view;
//   }
// });
document.querySelector('.search').addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(1);
  if (searchHistoryArr.length > 10) searchHistoryArr.shift();
  searchHistoryArr.push(t.value);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArr));
  t.value = '';
  const view = JSON.parse(localStorage.getItem('searchHistory')).reduce(
    (acc, info) => {
      return (
        acc +
        `<li class="history-search-word"><a href="#">${info}</a>
          <button class="history-delete-btn">삭제</button>
        </li>`
      );
    },
    ''
  );
  s.innerHTML = '';
  s.innerHTML += view;
});

const deleteBtn = document.querySelector('.history-search-words');
deleteBtn.addEventListener('click', ({ target }) => {
  if (target.className === 'history-delete-btn') {
    const removedText = target.parentNode.innerText
      .split('\n')
      .filter((v) => v !== '삭제');
    searchHistoryArr = searchHistoryArr.filter((v) => v != removedText);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArr));
    target.parentNode.remove();
  }
});

const Alldelete = document.querySelector('.history-serach-alldelete-btn');
Alldelete.addEventListener('click', () => {
  searchHistoryArr = [];
  localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArr));
  s.innerHTML = '';
});

const historyCloseBtn = document.querySelector('.history-serach-close-btn');
historyCloseBtn.addEventListener('click', () => {
  searchHistoryArr = [];
  localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArr));
  s.innerHTML = '';
  document.querySelector('.history-search-wrapper').classList.remove('active');
});
