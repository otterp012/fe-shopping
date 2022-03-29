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
}

export { SearchController };
