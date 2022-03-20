export class SearchBar {
  constructor(recentSearchKeywords, automaticCompletion) {
    this.$searchWrap = document.querySelector('.header__search-wrap');
    this.$searchInput = this.$searchWrap.querySelector('.search-input');
    this.recentSearchKeywords = recentSearchKeywords;
    this.automaticCompletion = automaticCompletion;
  }

  connect(recentSearchKeywords, automaticCompletion) {
    this.recentSearchKeywords = recentSearchKeywords;
    this.automaticCompletion = automaticCompletion;
  }

  addSearchValueSubmitEvent() {
    this.$searchWrap.querySelector('form').addEventListener('submit', e => {
      const searchValue = this.$searchInput.value;
      this.recentSearchKeywords.saveRecentSearchKeyword(searchValue);
    });
  }

  addSearchInputFocusEvent() {
    this.$searchInput.addEventListener('focus', () => {
      if (this.$searchInput.value) return;
      this.recentSearchKeywords.showRecentKeywords();
    });
  }

  addSearchInputKeyupEvent() {
    this.$searchInput.addEventListener('input', async ({ target }) => {
      const searchValue = target.value;
      if (searchValue) {
        this.recentSearchKeywords.hide();
        this.automaticCompletion.render(searchValue);
      } else {
        this.automaticCompletion.hide();
        this.recentSearchKeywords.show();
      }
    });
  }

  addEventListener() {
    this.addSearchValueSubmitEvent();
    this.addSearchInputFocusEvent();
    this.addSearchInputKeyupEvent();
  }

  moveFocus() {
    document.addEventListener('click', ({ target }) => {
      if (!target.closest('.search-bar-wrap')) {
        this.recentSearchKeywords.hide();
        this.automaticCompletion.hide();
      }
    });
  }

  innit(recentSearchKeywords, automaticCompletion) {
    this.connect(recentSearchKeywords, automaticCompletion);
    this.addEventListener();
    this.moveFocus();
  }
}
