import { selector, debounce } from '../utils/utils.js';
import { View } from './Veiw.js';

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

  hideWindow(node, hasvalue) {
    this.searchInputEl.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') return;
      if (
        hasvalue
          ? this.hasValue(this.searchInputEl)
          : !this.hasValue(this.searchInputEl)
      ) {
        this.hide(node);
      }
    });

    document.addEventListener('click', ({ target }) => {
      if (
        target.className === 'history-delete-btn' ||
        this.hasTargetParent(target, selector('.search-input-wrapper'))
      )
        return;
      this.hide(node);
    });
  }
  // 고생했던 부분-> 이 버튼을 누르면, 버튼의 부모가 지워지게되고
  // 그러면 hasTargetParent 함수가 동작을 안해서..
  // 이벤트의 순서를 알아보는 것이 힘들었음.

  arrow(displayedWrapper, listsNode, counter) {
    this.searchInputEl.addEventListener('keyup', ({ key }) => {
      if (!this.isDisplayed(displayedWrapper)) return;
      if (key === 'ArrowDown') {
        counter++;
        if (counter >= listsNode.childNodes.length) counter = 0;
        listsNode.childNodes.forEach((list) => {
          list.classList.remove('focus');
        });
        listsNode.childNodes[counter].focus();
        listsNode.childNodes[counter].classList.add('focus');

        this.searchInputEl.value = this.newInputValue(
          listsNode,
          counter,
          '삭제'
        );
      } else if (key === 'ArrowUp') {
        counter--;
        if (counter < 0) counter = listsNode.childNodes.length - 1;
        listsNode.childNodes.forEach((list) => {
          list.classList.remove('focus');
        });
        listsNode.childNodes[counter].focus();
        listsNode.childNodes[counter].classList.add('focus');

        // 이부분을 상속으로 줄 것을 염두에 두고, 작성했으나 초기 html 작성에 문제가 있어
        // searchhistory부분은 특정 text를 삭제해주어야 합니다.
        // 가능하면 완전 공통적인 로직으로 수정하고 싶습니다 😂
        this.searchInputEl.value = this.newInputValue(
          listsNode,
          counter,
          '삭제'
        );
      }
    });
  }

  newInputValue(node, counter, filterText = '') {
    if (filterText) {
      return node.childNodes[counter].innerText
        .split('\n')
        .filter((text) => text !== filterText);
    }
    return node.childNodes[counter].innerText;
  }
}

Object.assign(Searcher.prototype, View);

class SearchHistory extends Searcher {
  constructor() {
    super();
    this.searchHistoryArr = [];
    this.searchInputEl = selector('.search-bar');
    this.searchHistoryListsEl = selector('.history-search-lists');
    this.historySearchWrapperEl = selector('.history-search-wrapper');
    this.MAX_SEARCH_HISTORY_NUM = 11;
    this.LOCAL_STROAGE_NAME = 'searchHistory';
    this.listsCounter = -1;
    this.render();
  }

  render() {
    this.showWindow();
    this.hideWindow(this.historySearchWrapperEl, true);
    this.setEvent();
    this.arrow(
      this.historySearchWrapperEl,
      this.searchHistoryListsEl,
      this.listsCounter
    );
  }

  showWindow() {
    this.searchInputEl.addEventListener('focus', () => {
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
    if (this.historySearchWrapperEl.classList.contains('close')) {
      return;
    }
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
}

class SearchAutoComplete extends Searcher {
  constructor() {
    super();
    this.searchInputEl = selector('.search-bar');
    this.autoSearchWrapperEl = selector('.auto-search-wrapper');
    this.autoSearchLists = selector('.auto-search-lists');
    this.listsCounter = -1;
    this.render();
  }

  showWindow() {
    this.searchInputEl.addEventListener('keyup', ({ key }) => {
      if (key === 'Enter' || key === 'ArrowDown' || key === 'ArrowUp') {
        return;
      }
      this.show(this.autoSearchWrapperEl);
      // const debounceRender = debounce(
      //   (e) => this.renderSuggestions(e.target.value),
      //   500
      // );
      // debounceRender();
    });

    // 콜백안에서 디바운스 실행시키면 제대로 안먹힘
  }

  setEvent() {
    this.searchInputEl.addEventListener(
      'keyup',
      debounce((e) => this.renderSuggestions(e.target.value), 500)
    );
  }

  render() {
    this.showWindow();
    this.hideWindow(this.autoSearchWrapperEl, false);
    this.setEvent();
    this.arrow(
      this.autoSearchWrapperEl,
      this.autoSearchLists,
      this.listsCounter
    );
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

    const suggestionsHTML = this.addHighLight(suggestionsInfo).reduce(
      (acc, cur) => {
        return acc + this.template(cur);
      },
      ''
    );

    this.autoSearchLists.innerHTML = suggestionsHTML;
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
