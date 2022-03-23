import { $ } from '../../utility/util.js';

export default class RecentWord {
  constructor() {
    this.$searchHistory = $('#recent-words-menu');
    this.$historyDeleteBtn = $('.history-off-btn');
  }

  showRecentSearches() {
    this.$searchHistory.classList.remove('hidden');
  }

  noShowRecentSearches(relatedTarget) {
    if (relatedTarget && relatedTarget.className === 'history-off-btn') {
      this.addOfOffEventHistoryBtn();
      return;
    }

    this.$searchHistory.classList.add('hidden');
  }

  hideRecentSearches() {
    this.$searchHistory.classList.add('hidden');
  }

  addOfOffEventHistoryBtn() {
    this.$historyDeleteBtn.addEventListener('click', this.listOnOff);
  }

  listOnOff = ({ target }) => {
    const targetUl = target.parentElement.previousElementSibling;
    targetUl.classList.toggle('hidden');
  };
}
