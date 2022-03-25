import {
  AutocompleteModel,
  AutocompleteView,
  AutocompleteCotroller,
} from './search/autosearch.js';
import {
  SearchHistoryModel,
  SearchHistoryView,
  SearchHistoryController,
} from './search/historysearch.js';

function init() {
  new AutocompleteCotroller(new AutocompleteModel(), new AutocompleteView());

  new SearchHistoryController(
    new SearchHistoryModel(),
    new SearchHistoryView()
  );
}

init();
