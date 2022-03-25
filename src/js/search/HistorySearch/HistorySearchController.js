import { Controller } from '../../core/core.js';
import { hasTargetParent, hasValue } from '../../utils/utils.js';

class HistorySearchController extends Controller {
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

    this.view.clickEventHandlerForDisplayOff =
      this.clickEventHandlerForDisplayOff.bind(this);
  };

  submitEventHandlerForDisplaySearchHistory = (e) => {
    if (!hasValue(this.view.searchInputEl)) {
      return;
    }
    this.setStateProperty('isDisplayed', true);
    this.view.onOffView(this.model.getState('isDisplayed'));

    const newInputValue = this.view.searchInputEl.value;
    this.setStateProperty('searchInputValue', this.view.searchInputEl.value);
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
    const isSearchHistoryOn = this.model.getState('isSearchHistoryOn');
    if (isSearchHistoryOn) {
      this.setStateProperty('isSearchHistoryOn', false);
      this.view.renderOnOffSearchHistory(isSearchHistoryOn);
    } else {
      this.setStateProperty('isSearchHistoryOn', true);
      this.view.renderOnOffSearchHistory(isSearchHistoryOn);
    }
  };

  clickEventHandlerForDisplayOff = ({ target }, node) => {
    if (!this.model.getState('isDisplayed')) return;
    if (hasTargetParent(target, node)) return;
    this.setState({ isDisplayed: false });
    this.view.onOffView(this.model.getState('isDisplayed'));
  };
}

export { HistorySearchController };
