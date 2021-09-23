import AbstractView from '../../utils/abstract/abstract-view.js';
import { SortType } from '../../utils/sort.js';

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

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate(this._currentSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target !== evt.target.closest('.sort__button')) { return; }

    this.getElement().querySelector('.sort__button--active').classList.remove('sort__button--active');
    evt.target.classList.add('sort__button--active');

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}

