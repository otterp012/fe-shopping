import { SearchController } from '../Search/SearchController.js';
import { hasTargetParent, hasValue, selector } from '../../utils/utils.js';

class HistorySearchController extends SearchController {
  constructor(model, view) {
    super();
    this.model = model;
    this.view = view;
    this.setEvent();
  }
  setEvent = () => {
    this.view.submitEventHandlerForDisplaySearchHistory =
      this.submitEventHandlerForDisplaySearchHistory.bind(this);
    this.view.clickEventHandlerForDeleteSearchHistory =
      this.clickEventHandlerForDeleteSearchHistory.bind(this);
    this.view.clickEventHandlerForDeleteALLSearchHistory =
      this.clickEventHandlerForDeleteALLSearchHistory.bind(this);
    this.view.clickEventHandlerForOnOffSearchHistory =
      this.clickEventHandlerForOnOffSearchHistory.bind(this);
    this.view.keyUpEventHandlerForDisplayOnOff =
      this.keyUpEventHandlerForDisplayOnOff.bind(this);
    this.view.clickEventHandlerForDisplayOff =
      this.clickEventHandlerForDisplayOff.bind(this);
  };

  submitEventHandlerForDisplaySearchHistory = (newInputValue) => {
    if (!this.model.getState('isSearchHistoryOn')) return;
    this.setStateProperty('searchInputValue', newInputValue);
    this.render('historySearchLists');
  };

  clickEventHandlerForDeleteSearchHistory = (e) => {
    const filteredText = e.target.textContent;
    const removedSearchHistoryList = e.target.parentNode.innerText
      .split('\n')
      .filter((text) => text !== filteredText);

    this.setStateProperty('removedSearchHistoryList', removedSearchHistoryList);
    this.render('historySearchLists');
  };

  clickEventHandlerForDeleteALLSearchHistory = () => {
    this.setStateProperty('historySearchLists', []);
    this.render('historySearchLists');
  };

  clickEventHandlerForOnOffSearchHistory = () => {
    if (this.model.getState('isSearchHistoryOn')) {
      this.setStateProperty('isSearchHistoryOn', false);
      this.view.renderOnOffSearchHistory(
        this.model.getState('isSearchHistoryOn')
      );
    } else {
      this.setStateProperty('isSearchHistoryOn', true);
      this.view.renderOnOffSearchHistory(
        this.model.getState('isSearchHistoryOn')
      );
    }
  };
}

export { HistorySearchController };
