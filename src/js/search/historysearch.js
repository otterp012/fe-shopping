import { Model, View } from '../core/core.js';
import { selector } from '../utils/utils.js';
import { SearchController } from './searcher.js';
export { SearchHistoryModel, SearchHistoryView, SearchHistoryController };

class SearchHistoryModel extends Model {
  constructor() {
    super();
    this.setUp();
    this.MAX_SEARCH_HISTORY_NUM = 10;
  }

  setUp = () => {
    this.state = {
      historySearchLists: [],
    };
  };

  checkHistoryLength = () => {
    if (
      this.getState('historySearchLists').length > this.MAX_SEARCH_HISTORY_NUM
    )
      this.getState('historySearchLists').shift();
  };

  removeOverlap = () => {
    const nonOverlapSet = new Set(this.getState('historySearchLists'));
    this.setState({ historySearchLists: [...nonOverlapSet] });
  };

  refineData = () => {
    this.checkHistoryLength();
    this.removeOverlap();
  };

  // 데이터를 정제하는 것을 여기서 하려고 하니까 로직이 좀 이상해진 거 같은데
  // 여기서 하는 것이 맞겠죠?

  getSearchHistory(localStorageName) {
    return JSON.parse(localStorage.getItem(`${localStorageName}`));
  }

  setSearchHistory = (localStorageName, state) => {
    localStorage.setItem(`${localStorageName}`, JSON.stringify(state));
  };
}

class SearchHistoryView extends View {
  constructor() {
    super();
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
}

class SearchHistoryController extends SearchController {
  constructor(model, view) {
    super();
    this.model = model;
    this.view = view;
    this.searchInputEl = selector('.search-bar');
    this.historySearchWrapperEl = selector('.history-search-wrapper');
    this.searchHistoryListsEl = selector('.history-search-lists');
    this.LOCAL_STRAGE_NAME = 'historySearchStorage';
    this.listsCounter = -1;
    this.setEvent();
  }
  setEvent = () => {
    this.displaySearchHistory();
    this.showWindow(this.historySearchWrapperEl, false);
    this.hideWindow(this.historySearchWrapperEl, true);
    this.deleteSearchHistory();
    this.deleteAllSratchHistory();
    this.onOffSearchHistoryWindow();
    this.setArrowKeyEvent(
      this.historySearchWrapperEl,
      this.searchHistoryListsEl,
      this.listsCounter
    );
  };

  displaySearchHistory = () => {
    selector('.search').addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.hasValue(this.searchInputEl)) {
        this.model
          .getState('historySearchLists')
          .push(this.searchInputEl.value);
      }
      this.model.refineData();
      const newState = this.model.getState('historySearchLists');
      this.model.setSearchHistory(this.LOCAL_STRAGE_NAME, newState);
      this.setState({
        historySearchLists: this.model.getSearchHistory(this.LOCAL_STRAGE_NAME),
      });
      this.searchInputEl.value = '';
    });
  };

  deleteSearchHistory = () => {
    selector('.history-search-lists').addEventListener(
      'click',
      ({ target }) => {
        if (target.className === 'history-delete-btn') {
          const filteredText = target.textContent;
          const removedSearchHistory = target.parentNode.innerText
            .split('\n')
            .filter((text) => text !== filteredText);

          const newState = this.model
            .getState('historySearchLists')
            .filter((text) => text !== removedSearchHistory.toString());

          this.model.setSearchHistory(this.LOCAL_STRAGE_NAME, newState);
          this.setState({
            historySearchLists: this.model.getSearchHistory(
              this.LOCAL_STRAGE_NAME
            ),
          });
          target.parentNode.remove();
        }
      }
    );
  };

  deleteAllSratchHistory = () => {
    selector('.history-serach-alldelete-btn').addEventListener('click', () => {
      const newState = [];
      this.model.setSearchHistory(this.LOCAL_STRAGE_NAME, newState);
      this.setState({
        historySearchLists: this.model.getSearchHistory(this.LOCAL_STRAGE_NAME),
      });
    });
  };

  onOffSearchHistoryWindow = () => {
    selector('.history-serach-onOff-btn').addEventListener(
      'click',
      ({ target }) => {
        if (target.textContent === '최근검색어끄기') {
          this.addClassName(this.historySearchWrapperEl, 'close');
          const newState = [];
          this.model.setSearchHistory(this.LOCAL_STRAGE_NAME, newState);
          this.setState({
            historySearchLists: this.model.getSearchHistory(
              this.LOCAL_STRAGE_NAME
            ),
          });

          target.textContent = '최근검색어켜기';
          this.searchHistoryListsEl.innerHTML =
            '<div>최근 검색어 기능이 꺼져있습니다.</div>';
        } else {
          this.removeClassName(this.historySearchWrapperEl, 'close');
          target.textContent = '최근검색어끄기';
          this.searchHistoryListsEl.innerHTML = '';
        }
      }
    );
  };

  // 아래부분에 중복되는 부분이 많습니다 😂
}
