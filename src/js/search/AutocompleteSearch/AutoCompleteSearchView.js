import { View } from '../../core/core.js';
import { selector, debounce } from '../../utils/utils.js';

class AutoCompleteSearchView extends View {
  constructor() {
    super();
    this.searchInputEl = selector('.search-bar');
    this.autoSearchWrapperEl = selector('.auto-search-wrapper');
    this.renderAutoCompleteLists();
    this.onOffAutoCompleteDisplay();
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

  onOffView = (state) => {
    state
      ? (this.autoSearchWrapperEl.style.display = 'block')
      : (this.autoSearchWrapperEl.style.display = 'none');
  };

  onOffAutoCompleteDisplay = () => {
    this.searchInputEl.addEventListener('keyup', (e) =>
      this.keyUpEventHandlerForDisplayOnOff(e)
    );

    document.addEventListener('click', (e) =>
      this.clickEventHandlerForDisplayOff(e, this.autoSearchWrapperEl)
    );
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
