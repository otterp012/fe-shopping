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

  timer(callback, ms) {
    setTimeout(() => callback(), ms);
  }

  addEvent(node, type, eventHandler) {
    if (node.length > 1) {
      node.childNodes.forEach((child) => {
        child.addEventListener(`${type}`, (event) => {
          eventHandler(event);
        });
      });
    } else {
      node.addEventListener(`${type}`, (event) => {
        eventHandler(event);
      });
    }
  }

  addClassName(node, className) {
    node.classList.add(className);
  }

  removeClassName(node, className) {
    if (node.classList.contains(className)) {
      node.classList.remove(className);
    }
  }
}

class SearchHistoryGenerator extends Searcher {
  constructor() {
    super();
    this.searchHistoryArr = [];
    this.searchFormEl = document.querySelector('.search');
    this.searchInputEl = document.querySelector('.search-bar');
    this.searchHistoryListsEl = document.querySelector('.history-search-lists');
    this.historySearchWrapperEl = document.querySelector(
      '.history-search-wrapper'
    );
    this.historyAllDeleteBtnEl = document.querySelector(
      '.history-serach-alldelete-btn'
    );
    this.searchHistoryCloseBtn = document.querySelector(
      '.history-serach-close-btn'
    );
    this.MAX_SEARCH_HISTORY_NUM = 11;
    this.LOCAL_STROAGE_NAME = 'searchHistory';
    this.render();
  }

  render() {
    this.searchInputEl.addEventListener('focus', () => {
      if (!super.hasValue(this.searchInputEl)) {
        super.show(this.historySearchWrapperEl);
      }
    });

    this.searchInputEl.addEventListener('keyup', (event) => {
      if (event.keyCode == 13) {
        super.show(this.historySearchWrapperEl);
      }
    });

    this.hideSearchHistory();
    this.eventListener();
  }

  hideSearchHistory() {
    setInterval(() => {
      if (super.hasValue(this.searchInputEl)) {
        super.hide(this.historySearchWrapperEl);
      }
    });
    // focusout 이벤트가 필요합니다.
  }

  eventListener() {
    super.addEvent(
      document.body,
      'submit',
      this.displaySearchHistory.bind(this)
    );

    super.addEvent(
      this.historyAllDeleteBtnEl,
      'click',
      this.deleteAllSearchHistory.bind(this)
    );

    super.addEvent(document.body, 'click', this.deleteSearchHistory.bind(this));

    super.addEvent(
      this.searchHistoryCloseBtn,
      'click',
      this.closeSearchHistory.bind(this)
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
    this.searchHistoryArr = this.removeOverlap(this.searchHistoryArr);
    this.checkHistoryLength();
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
      const filteredText = event.target.textContent;
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

  deleteAllSearchHistory() {
    this.searchHistoryArr = [];
    this.setSearchHistory(this.LOCAL_STROAGE_NAME, this.searchHistoryArr);
    this.searchHistoryListsEl.innerHTML = '';
  }

  closeSearchHistory(event) {
    if (event.target.textContent === '최근검색어끄기') {
      super.addClassName(this.historySearchWrapperEl, 'close');
      event.target.textContent = '최근검색어켜기';
      this.deleteAllSearchHistory();
      this.searchHistoryListsEl.innerHTML =
        '<div>최근 검색어 기능이 꺼져있습니다.</div>';
    } else {
      super.removeClassName(this.historySearchWrapperEl, 'close');
      event.target.textContent = '최근검색어끄기';
      this.searchHistoryListsEl.innerHTML = '';
    }
  }
  // 이부분의 상수들을 정리해서 따로 저장해두고자 합니다. 😂
}

class SearchAutoGenerator extends Searcher {
  constructor() {
    super();
    this.searchInputEl = document.querySelector('.search-bar');
    this.autoSearchWrapperEl = document.querySelector('.auto-search-wrapper');
    this.render();
  }
  render() {
    this.searchInputEl.addEventListener('keyup', (e) => {
      if (!(e.keyCode === 13 && e.keyCode === 40)) {
        super.show(this.autoSearchWrapperEl);
        this.renderSuggestions(this.searchInputEl.value);
      } else {
        super.hide(this.autoSearchWrapperEl);
      }
    });

    setInterval(() => {
      if (!super.hasValue(this.searchInputEl)) {
        this.autoSearchWrapperEl.style.display = 'none';
      }
    });
  }

  template(str) {
    return `<li class="auto-search-list">${str}</li>`;
  }

  getSuggestions(prefix) {
    return fetch(
      `https://completion.amazon.com/api/2017/suggestions?session-id=133-4736477-7395454&customer-id=&request-id=4YM3EXKRH1QJB16MSJGT&page-type=Gateway&lop=en_US&site-variant=desktop&client-info=amazon-search-ui&mid=ATVPDKIKX0DER&alias=aps&b2b=0&fresh=0&ks=8&prefix=${prefix}&event=onKeyPress&limit=11&fb=1&suggestion-type=KEYWORD`
    ).then((res) => res.json());
    // 나중에 데이터를 받는 클래스로 옮길 부분.
  }

  async renderSuggestions(prefix) {
    const suggestionsJson = await this.getSuggestions(prefix);

    const suggestionsInfo = suggestionsJson.suggestions.map(
      (suggestion) => suggestion.value
    );

    const suggestionHighLighted = this.addHighLight(suggestionsInfo);
    const suggestionHTML = suggestionHighLighted.reduce((acc, cur) => {
      return acc + this.template(cur);
    }, '');

    document.querySelector('.auto-search-lists').innerHTML = '';
    document.querySelector('.auto-search-lists').innerHTML += suggestionHTML;
  }

  addHighLight(arr) {
    return arr.map((item) => {
      const inputValue = this.searchInputEl.value;
      const inputLength = this.searchInputEl.value.length;
      const arr = item.split('');
      let correspondedWord = arr.splice(0, inputLength);
      let lastWord = inputValue[inputLength - 1];
      let lastWordIndex = correspondedWord.lastIndexOf(lastWord);
      correspondedWord.splice(lastWordIndex + 1, 0, '</strong>');

      return (item = ['<strong>', ...correspondedWord, ...arr].join(''));
    });
  }
}

export { SearchHistoryGenerator, SearchAutoGenerator };
