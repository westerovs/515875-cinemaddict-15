/*
* главный презентер
* */
import dayjs from 'dayjs';
import { Films } from '../utils/const.js';
import { render, removeComponent, update } from '../utils/render.js';
import { getExtraTypeFilms } from '../utils/const.js';

import FilmPresenter from './film.js';
import SortView from '../view/sort.js';
import FilmsBoardView from '../view/film-board.js';
import FilmsListView from '../view/films-list.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import ShowMoreBtnView from '../view/show-more-btn.js';
import NoFilmsView from '../view/no-films.js';

export default class Movies {
  constructor(mainElement) {
    this._mainElement = mainElement;

    // ↓ запоминаем все созданные презентеры ↓
    this._filmPresenters = new Map();
    this._filmPresentersExtra = {
      topRated: new Map(),
      mostCommented: new Map(),
    };

    this._sortComponent = new SortView();
    this._filmsBoardComponent = new FilmsBoardView();
    this._filmsListComponent = new FilmsListView();
    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._noFilmsComponent = new NoFilmsView();

    this._films = null;
    this._filmsExtra = null;
    this._filmsBoard = null;
    this._filmsListMainContainer = null;
    this._topRatedFilmsList = null;
    this._mostCommentedFilmsList = null;
    this._defaultSort = null;

    this._initCountFilms = Films.SHOW_FILMS;
    this._renderedFilmsCount = Films.FILMS_LOAD_MORE;

    this._handlerLoadMoreBtnClick = this._handlerLoadMoreBtnClick.bind(this);
    this._handlerFilmsUpdate = this._handlerFilmsUpdate.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._filmsExtra = {
      topRated: getExtraTypeFilms(films).topRated,
      mostCommented: getExtraTypeFilms(films).mostCommented,
    };

    this._defaultSort = films.slice();
    this._renderBoard();
  }

  // главный метод для начала работы модуля
  _renderBoard() {
    // если фильмов нет
    if (!this._films.length) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();

    render(this._mainElement, this._filmsBoardComponent);
    this._filmsBoard = this._mainElement.querySelector('.films');

    this._renderFilmsContainer();
  }

  _renderNoFilms() {
    render(this._mainElement, this._noFilmsComponent);
  }

  _renderSort() {
    render(this._mainElement, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(target) {
    this._clearFilmsList();

    switch (target.dataset.sortType) {
      case 'default':
        this._films = this._defaultSort.slice();
        break;
      case 'date':
        this._films.sort((a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date)));
        break;
      case 'rating':
        this._films.sort((a, b) => +b.filmInfo.totalRating - +a.filmInfo.totalRating);
        break;
    }

    this._renderAllFilms();
  }

  _clearFilmsList() {
    this._filmPresenters.forEach((presenter) => presenter._destroyAll());
    this._filmPresenters.clear();

    Object.values(this._filmPresentersExtra)
      .forEach((extra) => {
        extra.forEach((presenter) => presenter._destroyAll());
        extra.clear();
      });

    this._renderedFilmsCount = Films.FILMS_LOAD_MORE;
    removeComponent(this._showMoreBtnComponent);
  }

  _renderFilmsContainer() {
    // render центрального контейнера для фильмов
    render(this._filmsBoard, this._filmsListComponent);
    const filmsListMain = this._filmsBoard.querySelector('.films-list--main');
    this._filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

    this._renderAllFilms(true);
  }

  _renderAllFilms(firstInit = false) {
    this._renderFilmsFromTo(this._filmsListMainContainer, 0, Math.min(this._initCountFilms, this._films.length));
    this._renderExtraFilmsContainer(firstInit);

    // show more cards
    if (this._films.length > Films.FILMS_LOAD_MORE) {
      this._renderLoadMoreBtn();
    }
  }

  _renderFilmsFromTo(container, from , to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilmPresenter(container, film));
  }

  _renderFilmPresenter(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handlerFilmsUpdate); // принимает ф-цию update
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

  _renderExtraFilmsContainer(firstInit = false) {
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
        this._filmsExtra.topRated.forEach((film) => this._renderFilmPresenter(this._topRatedFilmsList, film));
        break;
      case 'Most commented':
        this._filmsExtra.mostCommented.forEach((film) => this._renderFilmPresenter(this._mostCommentedFilmsList, film));
        break;
    }
  }

  _renderLoadMoreBtn() {
    const filmsListMain = this._filmsBoard.querySelector('.films-list--main');
    render(filmsListMain, this._showMoreBtnComponent);

    this._showMoreBtnComponent.setClickHandler(this._handlerLoadMoreBtnClick);
  }

  _handlerLoadMoreBtnClick() {
    this._renderFilmsFromTo(this._filmsListMainContainer, this._renderedFilmsCount, this._renderedFilmsCount + Films.FILMS_LOAD_MORE);
    this._renderedFilmsCount += Films.FILMS_LOAD_MORE;

    // удаление кнопки
    if (this._renderedFilmsCount >= this._films.length) {
      this._showMoreBtnComponent.getElement().removeEventListener('click', this._handlerLoadMoreBtnClick);
      removeComponent(this._showMoreBtnComponent);
    }
  }

  _handlerFilmsUpdate(updatedFilm) {
    // Вызывается в Film презентер, принимает обновлённые данные
    this._films = update(this._films, updatedFilm);
    this._defaultSort = update(this._defaultSort, updatedFilm);
    this._filmsExtra = getExtraTypeFilms(this._films);

    if (this._filmPresenters.get(updatedFilm.id)) {
      this._filmPresenters.get(updatedFilm.id).init(updatedFilm);
    }
    if (this._filmPresentersExtra.topRated.get(updatedFilm.id)) {
      this._filmPresentersExtra.topRated.get(updatedFilm.id).init(updatedFilm);
    }
    if (this._filmPresentersExtra.mostCommented.get(updatedFilm.id)) {
      this._filmPresentersExtra.mostCommented.get(updatedFilm.id).init(updatedFilm);
    }
  }
}
