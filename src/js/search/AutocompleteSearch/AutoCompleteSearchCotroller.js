import { SearchController } from '../Search/SearchController.js';

class AutoCompleteSearchCotroller extends SearchController {
  constructor(model, view) {
    super();
    this.model = model;
    this.view = view;
    this.setEvents();
  }

  setEvents = () => {
    this.view.renderAutoCompleteListsHandler =
      this.renderAutoCompleteListsHandler.bind(this);
    this.view.keyUpEventHandlerForDisplayOnOff =
      this.keyUpEventHandlerForDisplayOnOff.bind(this);
    this.view.clickEventHandlerForDisplayOff =
      this.clickEventHandlerForDisplayOff.bind(this);
    this.view.arrowKeyEventHandler = this.arrowKeyEventHandler.bind(this);
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
}

export { AutoCompleteSearchCotroller };
