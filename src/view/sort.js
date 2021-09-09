import Abstract from '../utils/abstract/abstract.js';
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

  _sortTypeChangeHandler(evt) {
    // todo - ('A') так лучше никогда не делать. Сделать проверку на класс
    if (evt.target !== evt.target.closest('A')) { return; }
    if (evt.target.classList.contains('sort__button--active')) { return; }

    if (!evt.target.classList.contains('sort__button--active')) {
      this.getElement().querySelector('.sort__button--active').classList.remove('sort__button--active');
      evt.target.classList.add('sort__button--active');
    }

    this._callback.sortCallback(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortCallback = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}

