import AbstractView from '../../utils/abstract/abstract-view.js';

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

const createSiteMenuTemplate = (filters, currentFilterType) => `<nav class="main-navigation">
    <div class="main-navigation__items">
      <div class="main-navigation__items">
        ${ createFilters(filters, currentFilterType) }
      </div>
    </div>
    <a href="#stats" class="main-navigation__additional
      ${ !currentFilterType ? 'main-navigation__additional--active' : '' }"
    ">Stats</a>
  </nav>`;

export default class MainMenu extends AbstractView {
  constructor(filter, currentFilterType) {
    super();
    this._filter = filter;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    // stats
    this._onStatsButtonClick = this._onStatsButtonClick.bind(this);
    this._filterButtons = this.getElement().querySelectorAll('.main-navigation__item ');
    this._statsButton = this.getElement().querySelector('.main-navigation__additional');

  }

  getTemplate() {
    return createSiteMenuTemplate(this._filter, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.closest('.main-navigation__item').dataset.name);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement()
      .querySelectorAll('.main-navigation__item')
      .forEach((filterButton) => filterButton.addEventListener('click', this._filterTypeChangeHandler));
  }

  // stats ↓
  _onStatsButtonClick(evt) {
    evt.preventDefault();

    if (!evt.target.classList.contains('main-navigation__additional--active')) {
      this._filterButtons.forEach((filterButton) => filterButton.classList.remove('main-navigation__item--active'));
      this._statsButton.classList.add('main-navigation__additional--active');
      this._callback.showStatusScreen();
    }
  }

  setOnStatsButtonClick(callback){
    this._callback.showStatusScreen = callback;
    this.getElement().querySelector('.main-navigation__additional')
      .addEventListener('click', this._onStatsButtonClick);
  }
}


