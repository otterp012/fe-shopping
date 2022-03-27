import { Controller } from '../../core/core.js';
import { hasTargetParent, hasValue } from '../../utils/utils.js';

class AutoCompleteSearchCotroller extends Controller {
  constructor(model, view) {
    super();
    this.model = model;
    this.view = view;
    this.setEvents();
  }

  setState = (newState) => {
    this.model.setState(newState);
  };

  setEvents = () => {
    this.view.renderAutoCompleteListsHandler =
      this.renderAutoCompleteListsHandler.bind(this);
    this.view.keyUpEventHandlerForDisplayOnOff =
      this.keyUpEventHandlerForDisplayOnOff.bind(this);
    this.view.clickEventHandlerForDisplayOff =
      this.clickEventHandlerForDisplayOff.bind(this);
  };

  renderAutoCompleteListsHandler = async (newInputValue) => {
    const beforeInputValue = this.model.getState('searchInputValue');
    const isAutoCompleteViewDisplayed = this.model.getState('isDisplayed');

    if (beforeInputValue === newInputValue || !isAutoCompleteViewDisplayed) {
      return;
    }

    const promiseAutocompleteLists =
      await this.model.getPromiseAutoCompleteLists(newInputValue);

    this.setState({
      promiseAutocompleteLists,
      searchInputValue: newInputValue,
    });
    this.view.render(this.model.getState('promiseAutocompleteLists'));
  };

  keyUpEventHandlerForDisplayOnOff = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      return;
    }

    if (hasValue(e.target)) {
      this.setState({ isDisplayed: true });
      this.view.onOffView(this.model.getState('isDisplayed'));
    } else {
      this.setState({ isDisplayed: false });
      this.view.onOffView(this.model.getState('isDisplayed'));
    }
  };

  clickEventHandlerForDisplayOff = ({ target }, node) => {
    if (!this.model.getState('isDisplayed')) return;
    if (hasTargetParent(target, node)) return;
    this.setState({ isDisplayed: false });
    this.view.onOffView(this.model.getState('isDisplayed'));
  };
}

export { AutoCompleteSearchCotroller };
