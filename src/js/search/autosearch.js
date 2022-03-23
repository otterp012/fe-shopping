import { Model, View, Controller } from '../core/core.js';
import { selector, debounce } from '../utils/utils.js';
import { SearchController } from './searcher.js';
export { AutocompleteModel, AutocompleteView, AutocompleteCotroller };

class AutocompleteModel extends Model {
  constructor() {
    super();
  }

  getPromiseAutoCompleteLists = async (prefix) => {
    const promiseAutoComplete = await fetch(
      `https://completion.amazon.com/api/2017/suggestions?session-id=133-4736477-7395454&customer-id=&request-id=4YM3EXKRH1QJB16MSJGT&page-type=Gateway&lop=en_US&site-variant=desktop&client-info=amazon-search-ui&mid=ATVPDKIKX0DER&alias=aps&b2b=0&fresh=0&ks=8&prefix=${prefix}&event=onKeyPress&limit=11&fb=1&suggestion-type=KEYWORD`
    );

    const promiseAutoCompleteJson = await promiseAutoComplete.json();
    const promistAutoCompleteLists =
      await promiseAutoCompleteJson.suggestions.map((v) => v.value);

    return promistAutoCompleteLists;
  };
}

class AutocompleteView extends View {
  constructor() {
    super();
    this.searchInputEl = selector('.search-bar');
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

  highLightList = (arr, targetValue) => {
    return arr.map(
      (list) =>
        (list = list.replace(targetValue, `<strong>${targetValue}</strong>`))
    );
  };
}

class AutocompleteCotroller extends SearchController {
  constructor(model, view) {
    super();
    this.model = model;
    this.view = view;
    this.searchInputEl = selector('.search-bar');
    this.autoSearchWrapperEl = selector('.auto-search-wrapper');
    this.autoSearchListsEl = selector('.auto-search-lists');
    this.listsCounter = -1;
    this.setEvents();
  }

  setState = (newState) => {
    this.model.setState(newState);
    this.render(this.model.getState(Object.keys(newState).join('')));
  };

  render = (state) => {
    this.view.render(state);
  };

  setEvents = () => {
    this.displayAutoCompleteLists();
    this.showWindow(this.autoSearchWrapperEl, true);
    this.hideWindow(this.autoSearchWrapperEl, false);
    this.setArrowKeyEvent(
      this.autoSearchWrapperEl,
      this.autoSearchListsEl,
      this.listsCounter
    );
  };

  displayAutoCompleteLists = () => {
    this.searchInputEl.addEventListener(
      'keyup',
      debounce(() => {
        const promiseAutocompleteLists = this.model.getPromiseAutoCompleteLists(
          this.searchInputEl.value
        );
        this.setState({
          promiseAutocompleteLists,
        });
      }, 500)
    );
  };
}
