import AbstractView from '../utils/abstract/abstract-view.js';
// import { isDay } from '../utils/days.js';

/* eslint-disable */

const createFilters = (filters, currentFilterType) => {
  let template = '';

  filters.forEach((filter) => {
    const { type, name, count } = filter;

      template += `
        <a href="#${ name }"
          class="main-navigation__item ${ currentFilterType === type ? 'main-navigation__item--active' : '' }"
          data-name="${ name }">${ name }
            <span class="main-navigation__item-count
              ${ name === 'All movies' ? 'visually-hidden' : '' }">${ count }
            </span>
        </a>`;
  });

  return template;
};

const createSiteMenuTemplate = (filters, currentFilterType) => {

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <div class="main-navigation__items">
        ${ createFilters(filters, currentFilterType) }
      </div>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class MainMenu extends AbstractView {
  constructor(filter, currentFilterType) {
    super();
    this._filter = filter;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filter, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.name);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement()
      .querySelectorAll('.main-navigation__item ')
      .forEach((filterButton) => filterButton.addEventListener('click', this._filterTypeChangeHandler));
  }
}


