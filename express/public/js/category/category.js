import { $, makeShoppingCategory } from '../utility/util.js';
import { model } from './category-model.js';

export default class Category {
  constructor() {
    this.$shoppingMenu = $('.shopping-popup-menu-list');
  }

  addMouseEvent() {
    model.makeData();
    const $category = $('.category');
    $category.addEventListener('mouseenter', this.showFirstContent);
    $category.addEventListener('mouseleave', this.noShowContent);
  }

  showFirstContent = ({ target }) => {
    if (!target.closest('div')) return;
    const categoryData = model.setData();
    target.nextElementSibling.classList.remove('hidden');

    const firstContentTemplate = makeShoppingCategory(categoryData, 'firstContent');

    this.$shoppingMenu.innerHTML = firstContentTemplate;
  };

  noShowContent = ({ target }) => {
    if (!target.closest('div')) return;
    target.nextElementSibling.classList.add('hidden');
  };
}
