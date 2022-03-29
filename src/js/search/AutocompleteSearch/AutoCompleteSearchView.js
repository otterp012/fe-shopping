import { SearchView } from '../../search/Search/SearchView.js';
import { selector, hasValue, debounce } from '../../utils/utils.js';

class AutoCompleteSearchView extends SearchView {
  constructor() {
    super();
    this.searchInputEl = selector('.search-bar');
    this.autoSearchWrapperEl = selector('.auto-search-wrapper');
    this.setEvents();
  }

  template = (state) => {
    return state.reduce(
      (acc, str) => acc + `<li class="auto-search-list">${str}</li>`,
      ''
    );
  };

  render = async (state) => {
    const autoSuggestions = await state;
    const highLightedLists = this.highLightList(
      autoSuggestions,
      this.searchInputEl.value
    );
    selector('.auto-search-lists').innerHTML = this.template(highLightedLists);
  };

  highLightList = (autoCompletsLists, targetValue) => {
    return autoCompletsLists.map(
      (list) =>
        (list = list.replace(targetValue, `<strong>${targetValue}</strong>`))
    );
  };

  setEvents = () => {
    this.renderAutoCompleteLists();
    this.onOffDisplay(this.autoSearchWrapperEl);
  };

  renderAutoCompleteLists = () => {
    this.searchInputEl.addEventListener(
      'keyup',
      debounce(
        () => this.renderAutoCompleteListsHandler(this.searchInputEl.value),
        500
      )
    );
  };
}

export { AutoCompleteSearchView };
