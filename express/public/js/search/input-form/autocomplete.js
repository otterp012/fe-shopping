import { $, getCompleteData } from '../../utility/util.js';
import RecentWord from './recent-words.js';

export default class Autocomplete {
  constructor() {
    this.$autocompleteMenu = $('#autocomplete-menu');
    this.$popupMenuList = $('#input-popup-menu-list');
    this.recentWord = new RecentWord();
  }
  showAutocomplete() {
    this.$autocompleteMenu.classList.remove('hidden');
  }

  noShowAutocomplete() {
    this.$autocompleteMenu.classList.add('hidden');
  }

  checkInputText() {
    const $searchInput = $('.search-input');
    const inputValue = $searchInput.value;

    if (!inputValue.length) {
      this.noShowAutocomplete();
      this.$popupMenuList.innerHTML = '검색 결과가 없습니다';
      this.recentWord.showRecentSearches();
      return;
    }

    this.showAutocomplete();
    this.changeInputToQuery(inputValue);
  }

  async changeInputToQuery(inputValue) {
    const firstWord = inputValue.split('')[0];
    const completeDataPromise = await getCompleteData(firstWord);

    if (!completeDataPromise) {
      this.$popupMenuList.innerHTML = '검색 결과가 없습니다';
      return;
    }

    this.delay500ms(completeDataPromise, inputValue);
  }

  delay500ms(completeDataPromise, inputValue) {
    setTimeout(() => this.showCompleteWord(completeDataPromise, inputValue), 300);
  }

  showCompleteWord(completeData, inputValue) {
    const dataTemplate = completeData.reduce(
      (pre, curList) => (pre += `${this.colorWord(inputValue, curList)}`),
      ''
    );

    this.$popupMenuList.innerHTML = dataTemplate;
  }

  colorWord(inputValue, curList) {
    const length = inputValue.length;
    const compareWord = curList.keyword.substring(0, length);
    const remainWord = curList.keyword.substring(length);

    if (inputValue !== compareWord) {
      return `<li class = "input-popup-menu-item"><span>${curList.keyword}</span></li>`;
    }

    return `<li class = "input-popup-menu-item"><strong class="color-blue">${compareWord}</strong>${remainWord}</li>`;
  }
}
