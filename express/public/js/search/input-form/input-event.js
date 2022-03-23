import { $ } from '../../utility/util.js';
import RecentWord from './recent-words.js';
import Autocomplete from './autocomplete.js';
import AutoKeyword from './auto-keyword.js';

export default class InputEvent {
  constructor() {
    this.recentWords = new RecentWord();
    this.autoComplete = new Autocomplete();
    this.autoKeyword = new AutoKeyword();
  }

  addInputEvent() {
    const $searchInput = $('.search-input');
    $searchInput.addEventListener('focus', this.drawInputMenu);
    $searchInput.addEventListener('blur', ({ relatedTarget }) => {
      this.nodrawHistoryContents(relatedTarget);
      this.nodrawAutocomplete();
    });
    $searchInput.addEventListener('keyup', this.drawAutocomplete);
  }

  drawInputMenu = () => {
    const $searchInput = $('.search-input');
    if ($searchInput.value) {
      this.autoComplete.checkInputText();
      return;
    }

    this.recentWords.showRecentSearches();
  };

  nodrawHistoryContents = (relatedTarget) => {
    console.log(relatedTarget);
    this.recentWords.noShowRecentSearches(relatedTarget);
  };

  drawAutocomplete = ({ code }) => {
    if (code === 'ArrowDown' || code === 'ArrowUp') {
      this.autoKeyword.findDirection(code);
    }

    this.recentWords.hideRecentSearches();
    this.autoComplete.checkInputText();
  };

  nodrawAutocomplete = () => this.autoComplete.noShowAutocomplete();
}
