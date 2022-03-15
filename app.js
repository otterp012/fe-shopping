const utils = {
  $(node) {
    return document.querySelector(`${node}`);
  },
};

class CommonVeiw {
  constructor() {}

  render() {
    throw 'overrding';
  }

  renderComponent(tag, className = '', text = '') {
    return `<${tag} class="${className}">${text}</${tag}>`;
  }

  addID(node, id) {
    utils.$(node).id = id;
  }

  insertComponent(parent, component) {
    utils.$(parent).innerHTML += component;
  }

  on(node, event, handler) {
    utils.$(node).addEventListener(event, handler);
  }

  hide(node) {
    utils.$(node).style.display = 'none';
  }

  show(node) {
    utils.$(node).style.display = 'auto';
  }
}

class TopbarGenerator extends CommonVeiw {
  constructor() {
    super();
    this.topBarInfo = {
      leftText: ['즐겨찾기', '입점신청'],
      rightText: ['로그인', '회원가입', '고객센터'],
      icon: {
        caretDown: 'fas fa-caret-down',
      },
    };
  }

  render() {
    const topBarComponents = this.makeTopbarComponents();
    this.insertComponent('body', topBarComponents.topBarWrapper);
    this.insertComponent('.top-bar-wrapper', topBarComponents.topBar);
    this.insertComponent('.top-bar', topBarComponents.leftTextContainer);
    this.insertComponent('.top-bar', topBarComponents.rightTextContainer);
    this.insertComponent(
      '.top-bar-left-text-container',
      topBarComponents.leftText
    );
    this.insertComponent(
      '.top-bar-left-text-container',
      topBarComponents.leftIcon
    );
    this.insertComponent(
      '.top-bar-right-text-container',
      topBarComponents.rightText
    );
  }

  makeTopbarComponents() {
    const topBarWrapper = this.renderComponent('div', 'top-bar-wrapper');
    const topBar = this.renderComponent('div', 'top-bar');
    const leftTextContainer = this.renderComponent(
      'div',
      'top-bar-left-text-container'
    );
    const rightTextContainer = this.renderComponent(
      'div',
      'top-bar-right-text-container'
    );
    const leftText = this.topBarInfo.leftText.reduce((acc, info) => {
      return acc + this.renderComponent('span', '', info);
    }, '');
    const leftIcon = this.renderComponent('i', this.topBarInfo.icon.caretDown);
    const rightText = this.topBarInfo.rightText.reduce((acc, info) => {
      return acc + this.renderComponent('span', '', info);
    }, '');

    return {
      topBarWrapper,
      topBar,
      leftTextContainer,
      rightTextContainer,
      leftText,
      leftIcon,
      rightText,
    };
  }
}

const n = new TopbarGenerator();
n.render();
