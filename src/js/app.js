import {
  SearchHistoryGenerator,
  SearchAutoGenerator,
} from './search/Searcher.js';

function init() {
  const searchHistory = new SearchHistoryGenerator();
  const searchAuto = new SearchAutoGenerator();
}

init();
