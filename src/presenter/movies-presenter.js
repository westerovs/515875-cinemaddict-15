/*
* ===== главный презентер =====
* */
import { getExtraTypeFilms, Films, UpdateType, UserAction, State } from '../utils/const.js';
import { render, removeComponent } from '../utils/render.js';
import { SortType, sortDateDown, sortRatingDown } from '../utils/sort.js';
import { FilterType, FilteredFilms } from '../utils/filter.js';

import FilmPresenter from './film-presenter.js';
import SortView from '../view/board/sort.js';
import FilmsBoardView from '../view/board/film-board.js';
import FilmsListView from '../view/board/films-list.js';
import FilmsListExtraView from '../view/board/films-list-extra.js';
import ShowMoreBtnView from '../view/board/show-more-btn.js';
import NoFilmsView from '../view/board/no-films.js';
import LoadingView from '../view/board/loading.js';

export default class MoviesPresenter {
  constructor(mainElement, model, filterModel, api) {
    this._mainElement = mainElement;
    this._moviesModel = model;
    this._filterModel = filterModel;

    this._filmsBoardComponent = new FilmsBoardView();
    this._filmsListComponent  = new FilmsListView();
    this._loadingComponent    = new LoadingView();
    this._noFilmsComponent    = null;

    // ↓ запоминаем все созданные презентеры ↓
    this._filmPresenters = new Map();
    this._filmPresentersExtra = {
      topRated: new Map(),
      mostCommented: new Map(),
    };

    this._activeFilter = FilterType.ALL;
    this._filmsBoard = null;
    this._filmsListMainContainer = null;
    this._filmsExtra = null;
    this._topRatedFilmsList = null;
    this._mostCommentedFilmsList = null;
    this._currentSortType = SortType.DEFAULT;
    this._renderedFilmsCount = Films.FILM_COUNT_PER_STEP;
    this._sortComponent = null;
    this._showMoreBtnComponent = null;
    this._isLoading = true;
    this._api = api;

    this._handleLoadMoreBtnClick = this._handleLoadMoreBtnClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderBoard();
  }

  _getFilms() {
    this._activeFilter = this._filterModel.getActiveFilter();
    const films = this._moviesModel.getFilms();
    const filteredFilms = FilteredFilms[this._activeFilter](films);

    this._filmsExtra = {
      topRated: getExtraTypeFilms(films).topRated,
      mostCommented: getExtraTypeFilms(films).mostCommented,
    };

    // сортируем отфильтрованный результат
    switch (this._currentSortType) {
      case SortType.DEFAULT: return filteredFilms;
      case SortType.DATE:    return filteredFilms.slice().sort(sortDateDown);
      case SortType.RATING:  return filteredFilms.slice().sort(sortRatingDown);
    }
  }

  // ----------- RENDERS ↓
  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!this._getFilms().length) {
      this._renderNoFilms();
      return;
    }

    this._renderSortList();

    render(this._mainElement, this._filmsBoardComponent);
    this._filmsBoard = this._mainElement.querySelector('.films');
    this._renderFilmList(true);
  }

  _renderFilmList(firstInit) {
    // render центрального контейнера для фильмов
    render(this._filmsBoard, this._filmsListComponent);

    const filmsListMain = this._filmsBoard.querySelector('.films-list--main');
    this._filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, this._renderedFilmsCount));

    this._renderFilms(this._filmsListMainContainer, films);
    this._renderFilmListExtra(firstInit);

    // show more cards
    if (filmsCount > this._renderedFilmsCount) {
      this._renderLoadMoreBtn();
    }
  }

  _renderFilms(container, films) {
    films.forEach((film) => this._renderFilm(container, film));
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(
      container,
      this._handleViewAction,
      this._filterModel.getActiveFilter(),
      this._api,
    );
    filmPresenter.init(film);

    switch (container) {
      case this._filmsListMainContainer: {
        this._filmPresenters.set(film.id, filmPresenter);
        break;
      }
      case this._topRatedFilmsList: {
        this._filmPresentersExtra.topRated.set(film.id, filmPresenter);
        break;
      }
      case this._mostCommentedFilmsList: {
        this._filmPresentersExtra.mostCommented.set(film.id, filmPresenter);
        break;
      }
    }
  }

  _renderFilmListExtra(firstInit = false) {
    if (this._filmsExtra.topRated.some((film) => +film.filmInfo.totalRating !== 0)) {
      if (firstInit) {
        render(this._filmsBoard, new FilmsListExtraView('Top rated', 'rated'));
        this._topRatedFilmsList = this._filmsBoard.querySelector('*[data-extra-type="rated"]');
      }
      this._renderAllExtraFilms('Top rated');
    }
    if (this._filmsExtra.mostCommented.some((film) => film.comments.size !== 0)) {
      if (firstInit) {
        render(this._filmsBoard, new FilmsListExtraView('Most commented', 'commented'));
        this._mostCommentedFilmsList = this._filmsBoard.querySelector('*[data-extra-type="commented"]');
      }
      this._renderAllExtraFilms('Most commented');
    }
  }

  _renderAllExtraFilms(name) {
    switch (name) {
      case 'Top rated':
        this._filmsExtra.topRated.forEach((film) => this._renderFilm(this._topRatedFilmsList, film));
        break;
      case 'Most commented':
        this._filmsExtra.mostCommented.forEach((film) => this._renderFilm(this._mostCommentedFilmsList, film));
        break;
    }
  }

  _renderSortList() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._mainElement, this._sortComponent);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({ resetRenderedFilmCount: true });
    this._renderBoard();
  }

  _renderLoadMoreBtn() {
    if (this._showMoreBtnComponent !== null) {
      this._showMoreBtnComponent = null;
    }

    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._showMoreBtnComponent.setClickHandler(this._handleLoadMoreBtnClick);

    const filmsListMain = this._filmsBoard.querySelector('.films-list--main');
    render(filmsListMain, this._showMoreBtnComponent);
  }

  _handleLoadMoreBtnClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmsCount, this._renderedFilmsCount + Films.FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);

    this._renderFilms(this._filmsListMainContainer, films);
    this._renderedFilmsCount = newRenderedFilmCount;

    // удаление кнопки
    if (this._renderedFilmsCount >= filmsCount) {
      this._showMoreBtnComponent.getElement().removeEventListener('click', this._handleLoadMoreBtnClick);
      removeComponent(this._showMoreBtnComponent);
    }
  }

  _handleViewAction(actionType, updateType, updatedFilm) {
    switch (actionType) {
      case UserAction.UPDATE_FILM_CARD:
        this._api.updateMovie(updatedFilm)
          .then((response) => {
            this._moviesModel.updateFilm(updateType, response);
          });
        break;

      case UserAction.ADD_NEW_COMMENT:
        this._setViewStateInOpenPopup(updatedFilm.id, State.SENDING_NEW_COMMENT);

        this._api.addNewComment(updatedFilm)
          .then((response) => {
            this._moviesModel.updateFilm(updateType, response);
          })
          .catch(() => {
            this._filmPresenters.get(updatedFilm.id).runErrorAnimations();
          });
        break;

      case UserAction.DELETE_COMMENT:
        this._setViewStateInOpenPopup(updatedFilm.id, State.DELETING);

        this._api.deleteComment(updatedFilm)
          .then(() => {
            this._moviesModel.updateFilm(updateType, updatedFilm);
          })
          .catch(() => {
            this._filmPresenters.get(updatedFilm.id).runErrorAnimations();
          });
        break;
    }
  }

  _handleModelEvent(updateType, updatedFilm) {
    switch (updateType) {
      case UpdateType.INIT:
        this._isLoading = false;
        removeComponent(this._loadingComponent);
        this._renderBoard();
        break;
      case UpdateType.PATCH:
        if (this._filmPresenters.get(updatedFilm.id)) {
          this._filmPresenters.get(updatedFilm.id).init(updatedFilm);
        }
        if (this._filmPresentersExtra.topRated.get(updatedFilm.id)) {
          this._filmPresentersExtra.topRated.get(updatedFilm.id).init(updatedFilm);
        }
        if (this._filmPresentersExtra.mostCommented.get(updatedFilm.id)) {
          this._filmPresentersExtra.mostCommented.get(updatedFilm.id).init(updatedFilm);
        }
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({ resetRenderedFilmCount: true, resetSortType: true });
        this._renderBoard();
        break;
    }
  }

  _setViewStateInOpenPopup(filmId, state) {
    if (this._filmPresenters.get(filmId) && this._filmPresenters.get(filmId).getFilmDetails()) {
      this._filmPresenters.get(filmId).setViewState(state);
    }
    if (this._filmPresentersExtra.topRated.get(filmId) && this._filmPresentersExtra.topRated.get(filmId).getFilmDetails()) {
      this._filmPresentersExtra.topRated.get(filmId).setViewState(state);
    }
    if (this._filmPresentersExtra.mostCommented.get(filmId) && this._filmPresentersExtra.mostCommented.get(filmId).getFilmDetails()) {
      this._filmPresentersExtra.mostCommented.get(filmId).setViewState(state);
    }
  }

  _renderNoFilms() {
    this._noFilmsComponent = new NoFilmsView(this._activeFilter);
    render(this._mainElement, this._noFilmsComponent);
  }

  _renderLoading() {
    render(this._mainElement, this._loadingComponent);
  }

  _clearBoard({ resetRenderedFilmCount = false, resetSortType = false } = {}) {
    const filmsCount = this._getFilms().length;

    // очищаем фильмы и экстра-фильмы
    this._filmPresenters.forEach((presenter) => presenter.destroy());
    this._filmPresenters.clear();
    Object.values(this._filmPresentersExtra).forEach((extra) => {
      extra.forEach((presenter) => presenter.destroy());
      extra.clear();
    });

    removeComponent(this._sortComponent);
    removeComponent(this._showMoreBtnComponent);
    removeComponent(this._filmsBoardComponent);
    removeComponent(this._loadingComponent);

    if (this._noFilmsComponent) {
      removeComponent(this._noFilmsComponent);
    }

    // resetRenderedFilmCount - количество показанных фильмов
    if (resetRenderedFilmCount) {
      this._renderedFilmsCount = Films.SHOW_FILMS;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    // resetSortType - сбросить тип сортировки
    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  destroy() {
    this._clearBoard({ resetRenderedFilmCardsCount: true, resetSortType: true });
  }
}
