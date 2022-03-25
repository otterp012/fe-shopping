import { View } from '../../core/core.js';
import { selector, addClassName, removeClassName } from '../../utils/utils.js';

class HistorySearchView extends View {
  constructor() {
    super();
    this.searchInputEl = selector('.search-bar');
    this.historySearchWrapperEl = selector('.history-search-wrapper');
    this.searchHistoryListsEl = selector('.history-search-lists');
    this.historyOnOffBtn = selector('.history-serach-onOff-btn');
    this.setEvents();
  }

  template = (str) => {
    return `<li class="history-search-list"><a href="#">${str}</a>
          <button class="history-delete-btn">삭제</button>
        </li>`;
  };

  render = (state) => {
    selector('.history-search-lists').innerHTML = state.reduce(
      (acc, list) => acc + this.template(list),
      ''
    );
  };

  setEvents = () => {
    this.displaySearchHistory();
    this.deleteSearchHistoryList();
    this.deleteAllSearchHistoryLists();
    this.onOffSearchHistory();
    this.onOffDisplay();
  };

  displaySearchHistory = () => {
    selector('.search').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitEventHandlerForDisplaySearchHistory();
      this.searchInputEl.value = '';
    });
  };

  deleteSearchHistoryList = () => {
    selector('.history-search-lists').addEventListener('click', (e) =>
      this.clickEventHandlerForDeleteSearchHistory(e)
    );
  };

  deleteAllSearchHistoryLists = () => {
    selector('.history-serach-alldelete-btn').addEventListener('click', () =>
      this.clickEventHandlerForDeleteALLSearchHistory()
    );
  };

  onOffSearchHistory = () => {
    this.historyOnOffBtn.addEventListener('click', () => {
      this.clickEventHandlerForOnOffSearchHistory();
    });
  };

  renderOnOffSearchHistory = (state) => {
    if (state) {
      addClassName(this.historySearchWrapperEl, 'close');
      this.searchHistoryListsEl.innerHTML =
        '<div>최근 검색어 기능이 꺼져있습니다.</div>';
      this.historyOnOffBtn.textContent = '최근검색어켜기';
    } else {
      removeClassName(this.historySearchWrapperEl, 'close');
      this.historyOnOffBtn.textContent = '최근검색어끄기';
      this.searchHistoryListsEl.innerHTML = '';
    }
  };

  onOffView = (state) => {
    state
      ? (this.historySearchWrapperEl.style.display = 'block')
      : (this.historySearchWrapperEl.style.display = 'none');
  };

  onOffDisplay = () => {
    document.addEventListener('click', (e) =>
      this.clickEventHandlerForDisplayOff(e, this.historySearchWrapperEl)
    );
  };
}

export { HistorySearchView };
