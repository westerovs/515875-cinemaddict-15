/* eslint-disable */

import MainMenuView from '../view/main-menu.js';
import { filterCallBack } from '../utils/filter.js';
import { FilterType, UpdateType } from '../utils/const.js';
import { render, removeComponent, replace } from '../utils/render.js';
// View
import RankView from '../view/rank.js';

export default class MainMenu {
  constructor(filtersContainer, headerContainer, filterModel, moviesModel) {
    this._filtersContainer = filtersContainer;
    this._headerContainer = headerContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;

    this._mainMenuComponent = null;
    this._rankComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._getWatchedFilmsCount = this._getWatchedFilmsCount.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevMainMenuComponent = this._mainMenuComponent;
    const prevRankComponent     = this._rankComponent;

    //                     отфильтрованные числа ↓   тип фильтра по умолчанию ↓ (ALL)
    this._mainMenuComponent = new MainMenuView(filters, this._filterModel.getFilter());
    this._mainMenuComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._rankComponent     = new RankView(this._getWatchedFilmsCount);

    // first init
    if (prevMainMenuComponent === null && prevRankComponent === null) {
      console.log('first init !')
      render(this._headerContainer, this._rankComponent);
      render(this._filtersContainer, this._mainMenuComponent);
      return;
    }

    console.warn('second init !')
    replace(this._rankComponent, prevRankComponent);
    replace(this._mainMenuComponent, prevMainMenuComponent);
    removeComponent(prevRankComponent);
    removeComponent(prevMainMenuComponent);
  }

  _getFilters() {
    const filmCards = this._moviesModel.getFilms();
    // возвращает отфильтрованные штуки
    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filterCallBack[FilterType.ALL](filmCards).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filterCallBack[FilterType.WATCHLIST](filmCards).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filterCallBack[FilterType.HISTORY](filmCards).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filterCallBack[FilterType.FAVORITES](filmCards).length,
      },
    ];
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    console.log(filterType)
    console.log(this._filterModel.getFilter())
    if (this._filterModel.getFilter() === filterType) {
      return;
    }
    // вызывает полную перерисовку всего
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getWatchedFilmsCount() {
    let watchedFilmsCount = null;

    // получаем просмотренные фильмы, для передачи в ранг пользователя
    this._getFilters().forEach((item) => {
      if(item.type === FilterType.HISTORY){
        watchedFilmsCount = item.count;
      }
    });

    return watchedFilmsCount;
  }
}
