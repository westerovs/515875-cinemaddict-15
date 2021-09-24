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
import { FilterType, FilterFilm } from '../utils/filter.js';
import { render, removeComponent, replace } from '../utils/render.js';

class MainMenuPresenter {
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
    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._statisticsClickHandler = this._statisticsClickHandler.bind(this);

    this._getWatchedFilmsCount = this._getWatchedFilmsCount.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);
  }

  init() {
    const filters = this._getFilters();
    this._moviesModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);

    const prevMainMenuComponent = this._mainMenuComponent;
    const prevRankComponent = this._rankComponent;

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
        count: FilterFilm[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        count: FilterFilm[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        count: FilterFilm[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        count: FilterFilm[FilterType.FAVORITES](films).length,
      },
    ];
  }

  _addHandlers() {
    this._mainMenuComponent.setFilterClickHandler(this._filterClickHandler);
    this._mainMenuComponent.setStatisticsClickHandler(this._statisticsClickHandler);
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

  _modelEventHandler() {
    this.init();
  }

  _filterClickHandler(filterType) {
    if (this._filterModel.getActiveFilter() === filterType) {
      return;
    }
    if (this._siteMainElement.querySelector('.statistic')) {
      this._destroyStatistics();
    }

    this._filterModel.setActiveFilter(UpdateType.MAJOR, filterType);
  }

  _statisticsClickHandler() {
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

export default MainMenuPresenter;
