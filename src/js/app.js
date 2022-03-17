import { utils } from './utils.js';

class Searcher {
  constructor() {}

  render() {
    throw 'override!';
  }

  hasValue(node) {
    if (node.value) return true;
    return false;
  }

  show(node) {
    node.style.display = 'block';
  }

  hide(node) {
    node.style.display = 'none';
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

  addEvent(node, type, eventHandler) {
    node.addEventListener(`${type}`, (event) => {
      eventHandler(event);
    });
  }
}

class SearchHistoryGenerator extends Searcher {
  constructor() {
    super();
    this.searchHistoryArr = [];
    this.searchFormEl = document.querySelector('.search');
    this.searchInputEl = document.querySelector('.search-bar');
    this.searchInputValue = this.searchInputEl.value;
    this.searchHistoryListsEl = document.querySelector('.history-search-lists');
    this.historySearchWrapperEl = document.querySelector(
      '.history-search-wrapper'
    );
    this.MAX_SEARCH_HISTORY_NUM = 11;
    this.LOCAL_STROAGE_NAME = 'searchHistory';
    this.DELAY = 2000;
    this.eventListener();
    this.render();
  }

  render() {
    this.searchInputEl.addEventListener('focus', () => {
      setInterval(() => {
        if (!this.searchInputEl.value) {
          this.show(this.historySearchWrapperEl);
        }
      });
    });

    this.searchInputEl.addEventListener('keyup', (event) => {
      if (event.keyCode == 13) {
        this.show(this.historySearchWrapperEl);
      }
    });

    this.hideSearchHistory();
  }

  hideSearchHistory() {
    this.searchInputEl.addEventListener('focus', () => {
      setInterval(() => {
        if (this.searchInputEl.value) {
          this.hide(this.historySearchWrapperEl);
        }
      });
    });
  }

  eventListener() {
    this.addEvent(
      this.searchFormEl,
      'submit',
      this.displaySearchHistory.bind(this)
    );

    this.addEvent(document.body, 'click', this.deleteSearchHistory.bind(this));

    this.addEvent(
      document.body,
      'click',
      this.deleteAllSearchHistory.bind(this)
    );
  }

  template(str) {
    return `<li class="history-search-list"><a href="#">${str}</a>
    <button class="history-delete-btn">삭제</button>
  </li>`;
  }

  setSearchHistory(localStorageName, arr) {
    localStorage.setItem(`${localStorageName}`, JSON.stringify(`${arr}`));
  }

  getSearchHistory(localStorageName) {
    return JSON.parse(localStorage.getItem(`${localStorageName}`)).split(',');
  }

  displaySearchHistory(event) {
    event.preventDefault();
    if (this.searchInputEl.value) {
      this.searchHistoryArr.push(this.searchInputEl.value);
    }
    this.searchInputEl.value = '';
    this.checkHistoryLength();
    this.searchHistoryArr = this.removeOverlap(this.searchHistoryArr);
    this.setSearchHistory(this.LOCAL_STROAGE_NAME, this.searchHistoryArr);

    const searchHistory = this.getSearchHistory(this.LOCAL_STROAGE_NAME).reduce(
      (acc, info) => {
        return acc + this.template(info);
      },
      ''
    );

    this.searchHistoryListsEl.innerHTML = '';
    this.searchHistoryListsEl.innerHTML += searchHistory;
  }

  checkHistoryLength() {
    if (this.searchHistoryArr.length >= this.MAX_SEARCH_HISTORY_NUM)
      this.searchHistoryArr.shift();
  }

  removeOverlap(arr) {
    const nonOverlapSet = new Set(arr);
    return [...nonOverlapSet];
  }

  deleteSearchHistory(event) {
    if (event.target.className === 'history-delete-btn') {
      const historyDeleteBtnEl = document.querySelector('.history-delete-btn');
      const filteredText = historyDeleteBtnEl.textContent;

      const removedSearchHistory = event.target.parentNode.innerText
        .split('\n')
        .filter((text) => text !== filteredText);

      this.searchHistoryArr = this.searchHistoryArr.filter(
        (text) => text !== removedSearchHistory.toString()
      );

      this.setSearchHistory(this.LOCAL_STROAGE_NAME, this.searchHistoryArr);
      event.target.parentNode.remove();
    }
  }

  deleteAllSearchHistory(event) {
    if (event.target.className === 'history-serach-alldelete-btn') {
      this.searchHistoryArr = [];
      this.setSearchHistory(this.LOCAL_STROAGE_NAME, this.searchHistoryArr);
      this.searchHistoryListsEl.innerHTML = '';
    }
  }
}

const zz = new SearchHistoryGenerator();
