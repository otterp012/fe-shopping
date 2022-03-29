import { SearchView } from '../../search/Search/SearchView.js';
import { selector, hasValue, debounce } from '../../utils/utils.js';

class AutoCompleteSearchView extends SearchView {
  constructor() {
    super();
    this.searchInputEl = selector('.search-bar');
    this.autoSearchWrapperEl = selector('.auto-search-wrapper');
    this.autoSearchListsEl = selector('.auto-search-lists');
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
    this.autoSearchListsEl.innerHTML = this.template(highLightedLists);
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
    this.foucsList(this.autoSearchListsEl);
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
