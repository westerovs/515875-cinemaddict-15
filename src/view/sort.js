import Abstract from './abstract.js';
import { SortType } from '../utils/const.js';

const createSortingTemplate = () => (
  `<ul class="sort">
    <li><a href="#" data-sort-type="${ SortType.DEFAULT }" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="${ SortType.DATE }" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="${ SortType.RATING }" class="sort__button">Sort by rating</a></li>
  </ul>`
);

export default class Sort extends Abstract {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate();
  }

  _sortTypeChangeHandler(e) {
    if (e.target !== e.target.closest('A')) { return; }
    this._callback.sotrCallback(e.target);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sotrCallback = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}

