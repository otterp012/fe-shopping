export class RecentSearchKeywords {
  constructor(RECENT_KEYWORDS_STORAGE_KEY, searchStorage) {
    this.$searchWrap = document.querySelector('.header__search-wrap');
    this.$recentKeywordsWrap = this.$searchWrap.querySelector('.search-recent-keywords-wrap');
    this.$recentKeywords = this.$recentKeywordsWrap.querySelector('.search-recent-keywords');
    this.RECENT_KEYWORDS_STORAGE_KEY = RECENT_KEYWORDS_STORAGE_KEY;
    this.searchStorage = searchStorage;
  }

  connect(searchBar) {
    this.searchBar = searchBar;
  }

  render() {
    this.$recentKeywords.innerHTML = '';
    const recentKeywordsData = this.searchStorage.getItem(this.RECENT_KEYWORDS_STORAGE_KEY);
    if (!recentKeywordsData) return;
    const recentKeywordsTemplate = recentKeywordsData
      .split(',')
      .map(
        keyword => `<li>
                        <a href="javascript:;"}"><span>${keyword}</span></a>
                        <button type="button" class="delete-button">삭제</button>
                      </li>`
      )
      .join('');
    this.$recentKeywords.insertAdjacentHTML('afterbegin', recentKeywordsTemplate);
  }

  show() {
    this.$recentKeywordsWrap.classList.add('active');
  }

  hide() {
    this.$recentKeywordsWrap.classList.remove('active');
  }

  showRecentKeywords() {
    if (this.$recentKeywordsWrap.querySelectorAll('li').length) this.show();
  }

  saveRecentSearchKeyword(searchValue) {
    if (!searchValue) return;
    console.log(searchValue);
    const searchValues = this.searchStorage.getItem(this.RECENT_KEYWORDS_STORAGE_KEY)
      ? `${this.searchStorage.getItem(this.RECENT_KEYWORDS_STORAGE_KEY)},${searchValue}`
      : searchValue;
    this.searchStorage.setItem(this.RECENT_KEYWORDS_STORAGE_KEY, searchValues);
  }

  addAllDeleteButtonEvent() {
    this.$recentKeywordsWrap.querySelector('.all-delete-button').addEventListener('click', () => {
      this.searchStorage.removeItem(this.RECENT_KEYWORDS_STORAGE_KEY);
      this.$recentKeywordsWrap.classList.remove('active');
      this.render();
    });
  }

  addSwitchButtonEvent() {
    this.$recentKeywordsWrap.querySelector('.switch-button').addEventListener('click', () => {
      this.$recentKeywordsWrap.classList.remove('active');
    });
  }

  addEventListener() {
    this.addAllDeleteButtonEvent();
    this.addSwitchButtonEvent();
  }

  innit(searchBar) {
    this.connect(searchBar);
    this.render();
    this.addEventListener();
  }
}
