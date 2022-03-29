import { Controller } from '../../core/core.js';
import { hasTargetParent, hasValue, selector } from '../../utils/utils.js';

class SearchController extends Controller {
  constructor() {
    super();
  }

  keyUpEventHandlerForDisplayOnOff = (e, node) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      return;
    }
    const targetHasValueFlag =
      this.constructor.name === 'AutoCompleteSearchCotroller'
        ? hasValue(e.target)
        : !hasValue(e.target);

    if (targetHasValueFlag) {
      this.setStateProperty('isDisplayed', true);
      this.view.convertDisplay(this.model.getState('isDisplayed'), node);
    } else {
      this.setStateProperty('isDisplayed', false);
      this.view.convertDisplay(this.model.getState('isDisplayed'), node);
    }
  };

  clickEventHandlerForDisplayOff = (target, node) => {
    if (target.className === 'history-delete-btn') return;
    if (hasTargetParent(target, node)) return;
    this.setStateProperty('isDisplayed', false);
    this.view.convertDisplay(this.model.getState('isDisplayed'), node);
  };

  updateFocusedList = (node, counter) => {
    node.childNodes.forEach((list) => {
      list.classList.remove('focus');
    });
    node.childNodes[counter].focus();
    node.childNodes[counter].classList.add('focus');
  };

  arrowKeyEventHandler = (key, listsNode) => {
    if (key === 'ArrowDown') {
      let arrowEventCounter = this.model.getState('arrowEventCounter') + 1;
      this.setStateProperty('arrowEventCounter', arrowEventCounter);

      if (arrowEventCounter >= listsNode.childNodes.length) {
        arrowEventCounter = 0;
        this.setStateProperty('arrowEventCounter', arrowEventCounter);
      }
      this.updateFocusedList(listsNode, arrowEventCounter);
    } else if (key === 'ArrowUp') {
      let arrowEventCounter = this.model.getState('arrowEventCounter') - 1;
      this.setStateProperty('arrowEventCounter', arrowEventCounter);
      if (arrowEventCounter < 0) {
        arrowEventCounter = listsNode.childNodes.length - 1;
        this.setStateProperty('arrowEventCounter', arrowEventCounter);
      }
      this.updateFocusedList(listsNode, arrowEventCounter);
    }
  };
}

export { SearchController };
