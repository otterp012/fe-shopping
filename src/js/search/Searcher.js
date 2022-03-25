class Searcher {
  constructor() {}

  render() {
    throw 'override!';
  }

  setEvent() {
    throw 'override!';
  }

  showWindow() {
    throw 'override!';
  }

  hideWindow() {
    throw 'override!';
  }
}

const commonView = {
  hasValue: (node) => {
    return !!node.value;
  },

  show: (node) => {
    node.style.display = 'block';
  },
  hide: (node) => {
    node.style.display = 'none';
  },

  timer: (callback, ms) => {
    setTimeout(() => callback(), ms);
  },

  addEvent: (node, type, eventHandler) => {
    node.addEventListener(`${type}`, (event) => {
      eventHandler(event);
    });
  },

  addClassName: (node, className) => {
    node.classList.add(className);
  },

  removeClassName: (node, className) => {
    if (node.classList.contains(className)) {
      node.classList.remove(className);
    }
  },

  hasTargetParent: (node, target) => {
    if (node) {
      let current = node;
      while (true) {
        let parent = current.parentNode;
        current = parent;
        if (parent === document.body) return false;
        if (parent === target) return true;
      }
    }
  },

  isDisplayed: (node) => {
    return node.style.display === 'none' ? false : true;
  },
};

Object.assign(Searcher.prototype, commonView);

function selector(query, start = document.body) {
  return start.querySelector(`${query}`);
}

class SearchHistory extends Searcher {
  constructor() {
    super();
    this.searchHistoryArr = [];
    this.searchInputEl = selector('.search-bar');
    this.searchHistoryListsEl = selector('.history-search-lists');
    this.historySearchWrapperEl = selector('.history-search-wrapper');
    this.MAX_SEARCH_HISTORY_NUM = 11;
    this.LOCAL_STROAGE_NAME = 'searchHistory';
    this.render();
  }

  render() {
    this.showWindow();
    this.hideWindow();
    this.setEvent();
    this.arrowDown();
  }

  showWindow() {
    this.searchInputEl.addEventListener('focusin', () => {
      if (!this.hasValue(this.searchInputEl)) {
        this.show(this.historySearchWrapperEl);
      }
    });

    this.searchInputEl.addEventListener('keyup', () => {
      if (!this.hasValue(this.searchInputEl)) {
        this.show(this.historySearchWrapperEl);
      }
    });
  }

  hideWindow() {
    this.searchInputEl.addEventListener('keyup', (e) => {
      if (!(e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        if (this.hasValue(this.searchInputEl)) {
          this.hide(this.historySearchWrapperEl);
        }
      }
    });

    document.addEventListener('click', ({ target }) => {
      if (target.className !== 'history-delete-btn') {
        if (!this.hasTargetParent(target, selector('.search-input-wrapper'))) {
          this.hide(this.historySearchWrapperEl);
        }
      }
    });
  }
  // 고생했던 부분-> 이 버튼을 누르면, 버튼의 부모가 지워지게되고
  // 그러면 hasTargetParent 함수가 동작을 안해서..
  // 이벤트의 순서를 알아보는 것이 힘들었음.

  setEvent() {
    selector('.search').addEventListener('submit', (event) => {
      this.displaySearchHistory(event);
    });

    this.searchHistoryListsEl.addEventListener('click', (event) => {
      this.deleteSearchHistory(event);
    });

    selector('.history-serach-alldelete-btn').addEventListener('click', () => {
      this.deleteAllSearchHistory();
    });

    selector('.history-serach-onOff-btn').addEventListener('click', (event) => {
      this.onOffSearchHistoryWindow(event);
    });
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
    if (this.hasValue(this.searchInputEl)) {
      this.searchHistoryArr.push(this.searchInputEl.value);
    }
    this.searchInputEl.value = '';
    this.removeOverlap();
    this.checkHistoryLength();
    this.setSearchHistory(this.LOCAL_STROAGE_NAME, this.searchHistoryArr);

    const searchHistory = this.getSearchHistory(this.LOCAL_STROAGE_NAME).reduce(
      (acc, info) => {
        return acc + this.template(info);
      },
      ''
    );

    this.searchHistoryListsEl.innerHTML = searchHistory;
  }

  checkHistoryLength() {
    if (this.searchHistoryArr.length >= this.MAX_SEARCH_HISTORY_NUM)
      this.searchHistoryArr.shift();
  }

  removeOverlap() {
    const nonOverlapSet = new Set(this.searchHistoryArr);
    this.searchHistoryArr = [...nonOverlapSet];
  }

  deleteSearchHistory({ target }) {
    if (target.className === 'history-delete-btn') {
      const filteredText = target.textContent;
      const removedSearchHistory = target.parentNode.innerText
        .split('\n')
        .filter((text) => text !== filteredText);

      this.searchHistoryArr = this.searchHistoryArr.filter(
        (text) => text !== removedSearchHistory.toString()
      );

      this.setSearchHistory(this.LOCAL_STROAGE_NAME, this.searchHistoryArr);
      target.parentNode.remove();
    }
  }

  deleteAllSearchHistory() {
    this.searchHistoryArr = [];
    localStorage.removeItem('this.LOCAL_STROAGE_NAME');
    this.searchHistoryListsEl.innerHTML = '';
  }

  onOffSearchHistoryWindow({ target }) {
    if (target.textContent === '최근검색어끄기') {
      this.addClassName(this.historySearchWrapperEl, 'close');
      this.deleteAllSearchHistory();
      target.textContent = '최근검색어켜기';
      this.searchHistoryListsEl.innerHTML =
        '<div>최근 검색어 기능이 꺼져있습니다.</div>';
    } else {
      this.removeClassName(this.historySearchWrapperEl, 'close');
      target.textContent = '최근검색어끄기';
      this.searchHistoryListsEl.innerHTML = '';
    }
  }

  arrowDown() {
    let count = -1;
    this.searchInputEl.addEventListener('keyup', (e) => {
      if (this.isDisplayed(this.historySearchWrapperEl)) {
        if (e.key === 'ArrowDown') {
          count++;
          if (count >= this.searchHistoryArr.length) count = 0;
          selector('.history-search-lists').childNodes.forEach((list) => {
            list.classList.remove('focus');
          });
          selector('.history-search-lists').childNodes[count].focus();
          selector('.history-search-lists').childNodes[count].classList.add(
            'focus'
          );
          this.searchInputEl.value = selector('.history-search-lists')
            .childNodes[count].innerText.split('\n')
            .filter((value) => value !== '삭제');
        } else if (e.key === 'ArrowUp') {
          count--;
          if (count < 0) count = this.searchHistoryArr.length - 1;
          selector('.history-search-lists').childNodes.forEach((list) => {
            list.classList.remove('focus');
          });
          selector('.history-search-lists').childNodes[count].focus();
          selector('.history-search-lists').childNodes[count].classList.add(
            'focus'
          );
          this.searchInputEl.value = selector('.history-search-lists')
            .childNodes[count].innerText.split('\n')
            .filter((value) => value !== '삭제');
        }
      }
    });
  }
}

class SearchAutoComplete extends Searcher {
  constructor() {
    super();
    this.searchInputEl = selector('.search-bar');
    this.autoSearchWrapperEl = selector('.auto-search-wrapper');
    this.render();
  }

  showWindow() {
    this.searchInputEl.addEventListener('keyup', (e) => {
      if (
        !(e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp')
      ) {
        this.show(this.autoSearchWrapperEl);
        this.renderSuggestions(this.searchInputEl.value);
      }
    });
  }

  hideWindow() {
    this.searchInputEl.addEventListener('keyup', () => {
      if (!this.searchInputEl.value) this.hide(this.autoSearchWrapperEl);
    });

    document.addEventListener('click', ({ target }) => {
      if (!this.hasTargetParent(target, selector('.search-input-wrapper'))) {
        this.hide(this.autoSearchWrapperEl);
      }
    });
  }

  render() {
    this.showWindow();
    this.hideWindow();
    this.arrowDown();
  }

  template(str) {
    return `<li class="auto-search-list">${str}</li>`;
  }

  arrowDown() {
    let count = -1;
    this.searchInputEl.addEventListener('keyup', (e) => {
      if (this.isDisplayed(this.autoSearchWrapperEl)) {
        if (e.key === 'ArrowDown') {
          count++;
          if (count >= 10) count = 0;
          selector('.auto-search-lists').childNodes.forEach((list) => {
            list.classList.remove('focus');
          });
          selector('.auto-search-lists').childNodes[count].focus();
          selector('.auto-search-lists').childNodes[count].classList.add(
            'focus'
          );
          this.searchInputEl.value =
            selector('.auto-search-lists').childNodes[count].textContent;
        } else if (e.key === 'ArrowUp') {
          count--;
          if (count < 0) count = 9;
          console.log(count);
          selector('.auto-search-lists').childNodes.forEach((list) => {
            list.classList.remove('focus');
          });
          selector('.auto-search-lists').childNodes[count].focus();
          selector('.auto-search-lists').childNodes[count].classList.add(
            'focus'
          );
          this.searchInputEl.value =
            selector('.auto-search-lists').childNodes[count].textContent;
        }
      }
    });
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

    const suggestionHTML = this.addHighLight(suggestionsInfo).reduce(
      (acc, cur) => {
        return acc + this.template(cur);
      },
      ''
    );

    selector('.auto-search-lists').innerHTML = suggestionHTML;
  }

  addHighLight(arr) {
    return arr.map((item) => {
      const inputValue = this.searchInputEl.value;
      const inputLength = this.searchInputEl.value.length;
      const arr = item.split('');
      const correspondedWord = arr.splice(0, inputLength);
      const lastWord = inputValue[inputLength - 1];
      const lastWordIndex = correspondedWord.lastIndexOf(lastWord);
      correspondedWord.splice(lastWordIndex + 1, 0, '</strong>');

      return (item = ['<strong>', ...correspondedWord, ...arr].join(''));
    });
  }
}

export { SearchHistory, SearchAutoComplete };
