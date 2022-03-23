import { $ } from '../../utility/util.js';

export default class AutoKeyword {
  constructor() {
    this.$popupMenuList = $('#input-popup-menu-list');
    this.$searchInput = $('.search-input');
    this.count = 1;
  }

  findDirection(code) {
    if (!this.$popupMenuList.firstElementChild) return;

    if (code === 'ArrowDown') this.chooseWordDownside();
    else if (code === 'ArrowUp') this.chooseWordUpside();
  }

  chooseWordDownside() {
    if (this.count > this.$popupMenuList.childElementCount) this.count = 1;

    this.changeInputValue();
    this.count++;
  }

  chooseWordUpside() {
    if (this.count < 1) this.count = this.$popupMenuList.childElementCount;
    this.changeInputValue();
    this.count--;
  }

  changeInputValue() {
    const selectedList = $(`#input-popup-menu-list > li:nth-child(${this.count}`);
    this.$searchInput.value = selectedList.textContent;
  }
}
