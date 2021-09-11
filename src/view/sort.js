import Abstract from '../utils/abstract/abstract.js';
import { SortType } from '../utils/const.js';

const createSortingTemplate = (currentSortType) => (
  `<ul class="sort">
    <li>
      <a href="#"
        data-sort-type="${ SortType.DEFAULT }"
        class="sort__button ${ currentSortType === SortType.DEFAULT ?  'sort__button--active' : '' }">Sort by default
      </a>
    </li>
    <li>
      <a href="#"
        data-sort-type="${ SortType.DATE }"
        class="sort__button ${ currentSortType === SortType.DATE ?  'sort__button--active' : '' }">Sort by date
      </a>
    </li>
    <li>
      <a href="#"
        data-sort-type="${ SortType.RATING }"
        class="sort__button ${ currentSortType === SortType.RATING ?  'sort__button--active' : '' }">Sort by rating
      </a>
    </li>
  </ul>`
);

export default class Sort extends Abstract {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    // todo - ('A') так лучше никогда не делать. Сделать проверку на класс
    if (evt.target !== evt.target.closest('A')) { return; }

    this.getElement().querySelector('.sort__button--active').classList.remove('sort__button--active');
    evt.target.classList.add('sort__button--active');

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}

