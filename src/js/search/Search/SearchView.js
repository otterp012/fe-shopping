class SearchView {
  constructor() {}

  template = () => {
    throw 'override!';
  };

  render = () => {
    throw 'override!';
  };

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

  foucsList = (listsNode) => {
    this.searchInputEl.addEventListener('keyup', ({ key }) => {
      this.arrowKeyEventHandler(key, listsNode);
    });
  };
}

export { SearchView };
