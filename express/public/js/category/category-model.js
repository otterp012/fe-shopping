import { fetchData } from '../utility/util.js';

class Model {
  constructor() {
    this.categoryData;
  }

  async makeData() {
    const jsonData = await fetchData('/categoryData');
    this.categoryData = jsonData.categoryData;
  }

  setData() {
    return this.categoryData;
  }
}

export const model = new Model();
