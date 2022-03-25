import { Model } from '../../core/core.js';

class AutoCompleteSearchModel extends Model {
  constructor() {
    super();
    this.setUp();
  }

  setUp = () => {
    this.state = {
      promistAutoCompleteLists: null,
      isDisplayed: false,
      searchInputValue: null,
    };
  };

  getPromiseAutoCompleteLists = async (prefix) => {
    const promiseAutoComplete = await fetch(
      `https://completion.amazon.com/api/2017/suggestions?session-id=133-4736477-7395454&customer-id=&request-id=4YM3EXKRH1QJB16MSJGT&page-type=Gateway&lop=en_US&site-variant=desktop&client-info=amazon-search-ui&mid=ATVPDKIKX0DER&alias=aps&b2b=0&fresh=0&ks=8&prefix=${prefix}&event=onKeyPress&limit=11&fb=1&suggestion-type=KEYWORD`
    );

    const promiseAutoCompleteJson = await promiseAutoComplete.json();
    const promistAutoCompleteLists =
      await promiseAutoCompleteJson.suggestions.map((v) => v.value);

    return promistAutoCompleteLists;
  };
}

export { AutoCompleteSearchModel };
