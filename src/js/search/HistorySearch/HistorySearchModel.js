import { Model } from '../../core/core.js';

class HistorySearchModel extends Model {
  constructor() {
    super();
    this.setUp();
  }

  setUp = () => {
    this.state = {
      historySearchLists: this.initHistorySearchLists(),
      searchInputValue: null,
      removedSearchHistoryList: null,
      isDisplayed: false,
      isSearchHistoryOn: true,
      MAX_SEARCH_HISTORY_NUM: 10,
      localStorage: localStorage,
      LOCAL_STROAGE_NAME: 'historySearchStorage',
      arrowEventCounter: -1,
    };

    Object.defineProperty(
      this.state,
      'searchInputValue',
      this.searchInputGetterSetter()
    );
    Object.defineProperty(
      this.state,
      'removedSearchHistoryList',
      this.RemoveListsGetterSetter()
    );

    Object.defineProperty(this.state, 'isDisplayed', {
      get() {
        return this._isDisplayed;
      },

      set(value) {
        this.arrowEventCounter = -1;
        this._isDisplayed = value;
      },
    });
  };

  searchInputGetterSetter = () => {
    return {
      get() {
        return this._searchInputValue;
      },

      set(value) {
        this.historySearchLists.push(value);
        this.historySearchLists = [...new Set(this.historySearchLists)];
        if (this.historySearchLists.length > this.MAX_SEARCH_HISTORY_NUM) {
          this.historySearchLists.shift();
        }
        this.localStorage.setItem(
          this.LOCAL_STROAGE_NAME,
          JSON.stringify(this.historySearchLists)
        );
        this._searchInputValue = value;
      },
    };
  };

  RemoveListsGetterSetter = () => {
    return {
      get() {
        return this._removedSearchHistoryList;
      },

      set(value) {
        this.historySearchLists = this.historySearchLists.filter(
          (list) => list !== value.toString()
        );
        this.localStorage.setItem(
          this.LOCAL_STROAGE_NAME,
          JSON.stringify(this.historySearchLists)
        );
        this._removedSearchHistoryList = value;
      },
    };
  };

  initHistorySearchLists = () => {
    return JSON.parse(localStorage.getItem('historySearchStorage'))
      ? JSON.parse(localStorage.getItem('historySearchStorage'))
      : [];
  };
}

export { HistorySearchModel };
