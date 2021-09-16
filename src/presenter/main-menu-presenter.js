/*
* Отвечает за работу:
*   - переключение фильтров
*   - переключение на экран статистики
*   - обновления звания пользователя
* */
import MainMenuView from '../view/main-menu/main-menu.js';
import StatisticsView from '../view/statistics/statistics.js';
import RankView from '../view/main-menu/rank.js';
import { UpdateType } from '../utils/const.js';
import { FilterType, FilteredFilms } from '../utils/filter.js';
import { render, removeComponent, replace } from '../utils/render.js';

/* eslint-disable */

export default class MainMenuPresenter {
  constructor(siteMainElement, headerContainer, filterModel, moviesModel, moviesPresenter) {
    this._siteMainElement = siteMainElement;
    this._headerContainer = headerContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._moviesPresenter = moviesPresenter;

    // view
    this._mainMenuComponent = null;
    this._statisticsComponent = null;
    this._rankComponent = null;

    // controls
    this._handleFilterClick = this._handleFilterClick.bind(this);
    this._handleStatisticsClick = this._handleStatisticsClick.bind(this);

    this._getWatchedFilmsCount = this._getWatchedFilmsCount.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();

    const prevMainMenuComponent = this._mainMenuComponent;
    const prevRankComponent = this._rankComponent;

    //                     отфильтрованные числа ↓   тип фильтра по умолчанию ↓ (ALL)
    this._mainMenuComponent = new MainMenuView(filters, this._filterModel.getActiveFilter());
    this._rankComponent = new RankView(this._getWatchedFilmsCount);

    this._addHandlers();

    // first init
    if (prevMainMenuComponent === null && prevRankComponent === null) {
      render(this._siteMainElement, this._mainMenuComponent);
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
        count: FilteredFilms[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        count: FilteredFilms[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        count: FilteredFilms[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        count: FilteredFilms[FilterType.FAVORITES](films).length,
      },
    ];
  }

  _addHandlers() {
    this._mainMenuComponent.setFilterClickHandler(this._handleFilterClick);
    this._mainMenuComponent.setStatisticsClickHandler(this._handleStatisticsClick);
  }

  _getWatchedFilmsCount() {
    let watchedFilmsCount = null;

    // получаем кол-во просмотренных фильмов, для передачи в ранг пользователя
    this._getFilters().forEach((item) => {
      if (item.type === FilterType.HISTORY) {
        watchedFilmsCount = item.count;
      }
    });

    return watchedFilmsCount;
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterClick(filterType) {
    if (this._filterModel.getActiveFilter() === filterType) {
      return;
    }
    if (this._siteMainElement.querySelector('.statistic')) {
      this._destroyStatistics()
    }

    // вызвать update
    this._filterModel.setActiveFilter(UpdateType.MAJOR, filterType);
  }

  _handleStatisticsClick() {
    this._moviesPresenter.destroy();
    this._statisticsComponent = new StatisticsView(this._moviesModel.getFilms());
    this._filterModel.setActiveFilter(null);

    render(this._siteMainElement, this._statisticsComponent);
  }

  _destroyStatistics() {
    removeComponent(this._statisticsComponent);
    this._statisticsComponent = null;
  }
}
