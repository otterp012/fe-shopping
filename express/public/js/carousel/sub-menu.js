import { $ } from '../utility/util.js';

export default class SideMenu {
  constructor() {
    this.container = $('.image-container');
  }

  findTargetImg = (target) => {
    if (!target.closest('li') || target.closest('img')) return;

    const selectNode = $(`#${target.id}`);
    this.changeImage(selectNode);
  };

  changeImage(selectNode) {
    if (selectNode === this.container.firstElementChild) {
      this.container.appendChild(selectNode);
    }

    this.container.insertBefore(selectNode, this.container.firstElementChild.nextElementSibling);
  }
}
