import { Model } from '../../core/core.js';

class HistorySearchModel extends Model {
  constructor() {
    super();
    this.setUp();
  }

  setUp = () => {
    this.state = {
      historySearchLists: [],
      searchInputValue: null,
      removedSearchHistoryList: null,
      isDisplayed: false,
      isSearchHistoryOn: true,
      MAX_SEARCH_HISTORY_NUM: 10,
    };

    Object.defineProperty(this.state, 'searchInputValue', {
      get() {
        return this._searchInputValue;
      },

      set(value) {
        this.historySearchLists.push(value);
        this.historySearchLists = [...new Set(this.historySearchLists)];
        if (this.historySearchLists.length > this.MAX_SEARCH_HISTORY_NUM) {
          this.historySearchLists.shift();
        }

        this._searchInputValue = value;
      },
    });

    Object.defineProperty(this.state, 'removedSearchHistoryList', {
      get() {
        return this._removedSearchHistoryList;
      },

      set(value) {
        this.historySearchLists = this.historySearchLists.filter(
          (list) => list !== value.toString()
        );
        this._removedSearchHistoryList = value;
      },
    });

    Object.defineProperty(this.state, 'isSearchHistoryOn', {
      get() {
        return this._isSearchHistoryOn;
      },

      set(value) {
        value ? this.historySearchLists : (this.historySearchLists = []);
        this._isSearchHistoryOn = value;
      },
    });
  };
}

export { HistorySearchModel };
