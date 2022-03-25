class Model {
  constructor(state) {
    this.state = state;
  }
  setUp = () => {
    throw 'override!';
  };

  setState = (newState) => {
    this.state = { ...this.state, ...newState };
  };

  getState = (key) => {
    return this.state[key];
  };

  get = () => this.state;
}

class View {
  constructor() {}

  template = () => {
    throw 'override!';
  };

  render = () => {
    throw 'override!';
  };
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  setState = (newState) => {
    this.model.setState(newState);
  };

  setStateProperty = (key, value) => {
    this.model.state[key] = value;
  };

  render = (state) => {
    this.view.render(this.model.getState(state));
  };
}

export { Model, View, Controller };
