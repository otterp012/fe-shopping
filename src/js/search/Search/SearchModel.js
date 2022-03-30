class SearchModel {
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

export { SearchModel };
