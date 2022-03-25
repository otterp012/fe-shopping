import { AutoCompleteSearchCotroller } from '../js/search/AutocompleteSearch/AutoCompleteSearchCotroller.js';
import { AutoCompleteSearchModel } from '../js/search/AutocompleteSearch/AutoCompleteSearchModel.js';
import { AutoCompleteSearchView } from '../js/search/AutocompleteSearch/AutoCompleteSearchView.js';
import { HistorySearchController } from '../js/search/HistorySearch/HistorySearchController.js';
import { HistorySearchModel } from '../js/search/HistorySearch/HistorySearchModel.js';
import { HistorySearchView } from '../js/search/HistorySearch/HistorySearchView.js';

function init() {
  new AutoCompleteSearchCotroller(
    new AutoCompleteSearchModel(),
    new AutoCompleteSearchView()
  );

  new HistorySearchController(
    new HistorySearchModel(),
    new HistorySearchView()
  );
}

init();
