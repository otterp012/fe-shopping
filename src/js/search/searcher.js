import { Controller } from '../core/core.js';
import { selector } from '../utils/utils.js';
export { SearchController };

class SearchController extends Controller {
  constructor() {
    super();
  }
  showWindow = (node, hasValue) => {
    this.searchInputEl.addEventListener('keyup', ({ key }) => {
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        return;
      }
      if (
        hasValue
          ? this.hasValue(this.searchInputEl)
          : !this.hasValue(this.searchInputEl)
      ) {
        this.show(node);
      }
    });

    this.searchInputEl.addEventListener('focus', () => {
      if (
        hasValue
          ? this.hasValue(this.searchInputEl)
          : !this.hasValue(this.searchInputEl)
      ) {
        this.show(node);
      }
    });
  };

  hideWindow = (node, hasValue) => {
    this.searchInputEl.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') return;
      if (
        hasValue
          ? this.hasValue(this.searchInputEl)
          : !this.hasValue(this.searchInputEl)
      ) {
        this.hide(node);
      }
    });

    document.addEventListener('click', ({ target }) => {
      if (
        target.className === 'history-delete-btn' ||
        this.hasTargetParent(target, selector('.search-input-wrapper'))
      )
        return;
      this.hide(node);
    });
  };

  setArrowKeyEvent = (displayedWrapper, listsNode, counter) => {
    this.searchInputEl.addEventListener('keyup', ({ key }) => {
      if (!this.isDisplayed(displayedWrapper)) return;
      if (key === 'ArrowDown') {
        counter++;
        if (counter >= listsNode.childNodes.length) counter = 0;
        listsNode.childNodes.forEach((list) => {
          list.classList.remove('focus');
        });
        listsNode.childNodes[counter].focus();
        listsNode.childNodes[counter].classList.add('focus');

        this.searchInputEl.value = this.newInputValue(
          listsNode,
          counter,
          '삭제'
        );
      } else if (key === 'ArrowUp') {
        counter--;
        if (counter < 0) counter = listsNode.childNodes.length - 1;
        listsNode.childNodes.forEach((list) => {
          list.classList.remove('focus');
        });
        listsNode.childNodes[counter].focus();
        listsNode.childNodes[counter].classList.add('focus');

        // 이부분을 상속으로 줄 것을 염두에 두고, 작성했으나 초기 html 작성에 문제가 있어
        // searchhistory부분은 특정 text를 삭제해주어야 합니다.
        // 가능하면 완전 공통적인 로직으로 수정하고 싶습니다 😂
        this.searchInputEl.value = this.newInputValue(
          listsNode,
          counter,
          '삭제'
        );
      }
    });
  };

  newInputValue = (node, counter, filterText = '') => {
    if (filterText) {
      return node.childNodes[counter].innerText
        .split('\n')
        .filter((text) => text !== filterText);
    }
    return node.childNodes[counter].innerText;
  };
}
