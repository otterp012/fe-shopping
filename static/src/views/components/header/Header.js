import { SearchCategoriesButton } from './search/SearchCategoriesButton.js';
import { SearchCategories } from './search/SearchCategories.js';
import { SearchBar } from './search/SearchBar.js';
import { RecentSearchKeywords } from './search/RecentSearchKeywords.js';
import { AutomaticCompletion } from './search/AutomaticCompletion.js';

export class Header {
  constructor() {
    this.RECENT_KEYWORDS_STORAGE_KEY = 'recentSearchKeywords';
    this.searchStorage = localStorage;
    this.searchCategories = new SearchCategories();
    this.searchCategoriesButton = new SearchCategoriesButton();
    this.recentSearchKeywords = new RecentSearchKeywords(this.RECENT_KEYWORDS_STORAGE_KEY, this.searchStorage);
    this.automaticCompletion = new AutomaticCompletion();
    this.searchBar = new SearchBar();
    this.innitSearchArea();
  }

  innitSearchArea() {
    this.searchCategories.innit(this.searchCategoriesButton);
    this.searchCategoriesButton.innit(this.searchCategories);
    this.recentSearchKeywords.innit(this.searchBar);
    this.automaticCompletion.innit(this.searchBar);
    this.searchBar.innit(this.recentSearchKeywords, this.automaticCompletion);
  }
}
