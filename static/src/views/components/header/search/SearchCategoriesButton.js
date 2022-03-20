export class SearchCategoriesButton {
  constructor() {
    this.$searchWrap = document.querySelector('.header__search-wrap');
    this.$categoriesButton = this.$searchWrap.querySelector('.search-categories-button');
  }

  conntect(searchCategories) {
    this.searchCategories = searchCategories;
  }

  render(selectedCategory = '전체') {
    this.$categoriesButton.textContent = selectedCategory;
  }

  addSearchCategoriesButtonEvent() {
    this.$categoriesButton.addEventListener('click', () => {
      this.searchCategories.toggle();
    });
  }

  addEventListener() {
    this.addSearchCategoriesButtonEvent();
  }

  innit(searchCategories) {
    this.conntect(searchCategories);
    this.addEventListener();
  }
}
