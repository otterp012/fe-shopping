import { View } from '../../core/core.js';

class SearchView extends View {
  constructor() {
    super();
  }

  convertDisplay = (state, node) => {
    node.style.display = state ? 'block' : 'none';
  };

  onOffDisplay = (node) => {
    this.searchInputEl.addEventListener('keyup', (e) =>
      this.keyUpEventHandlerForDisplayOnOff(e, node)
    );

    document.body.addEventListener('click', ({ target }) => {
      this.clickEventHandlerForDisplayOff(target, node);
    });
  };
}

export { SearchView };
