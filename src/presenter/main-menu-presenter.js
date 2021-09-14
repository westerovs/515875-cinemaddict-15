/*
* Отвечает за работу:
*   - обновление фильтров
*   - обновления звания пользователя
*   - переключение на экран статистики ( в будущем )
* */

import MainMenuView from '../view/main-menu/main-menu.js';
import RankView from '../view/main-menu/rank.js';
import { UpdateType } from '../utils/const.js';
import { FilterType, filterCallBack } from '../utils/filter.js';
import { render, removeComponent, replace } from '../utils/render.js';

export default class MainMenuPresenter {
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
      render(this._filtersContainer, this._mainMenuComponent);
      render(this._headerContainer, this._rankComponent);
      return;
    }

    replace(this._mainMenuComponent, prevMainMenuComponent);
    replace(this._rankComponent, prevRankComponent);
    removeComponent(prevMainMenuComponent);
    removeComponent(prevRankComponent);
  }

  _getFilters() {
    const films = this._moviesModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filterCallBack[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filterCallBack[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filterCallBack[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filterCallBack[FilterType.FAVORITES](films).length,
      },
    ];
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
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
