/*
* главный презентер
* */

/* eslint-disable */
import dayjs from 'dayjs';
import { Films, SortType } from '../utils/const.js';
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
  constructor(mainElement, model) {
    this._mainElement = mainElement;
    this._filmModel = model;
    this._filmsExtra = null;

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

    this._filmsBoard = null;
    this._filmsListMainContainer = null;
    this._topRatedFilmsList = null;
    this._mostCommentedFilmsList = null;
    this._currentSortType = SortType.DEFAULT;

    this._initCountFilms = Films.SHOW_FILMS;
    this._renderedFilmsCount = Films.FILMS_LOAD_MORE;

    this._handleLoadMoreBtnClick = this._handleLoadMoreBtnClick.bind(this);
    this._handleFilmsUpdate = this._handleFilmsUpdate.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._renderBoard();
  }

  _getFilms() {
    // учитывает сортировку !
    // повышает уровень абстракции
    // позволяет проводить манипуляции с задачами, какие нам нужны в презенторе в одном месте
    const filmCards = this._filmModel.getFilms();
    this._filmsExtra = {
      topRated: getExtraTypeFilms(filmCards).topRated,
      mostCommented: getExtraTypeFilms(filmCards).mostCommented,
    };

    switch (this._currentSortType) {
      case SortType.DEFAULT:
        console.log(`sort default`)
        return filmCards;
      case SortType.DATE:
        console.log(`sort date`)
        return filmCards
          .sort((a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date)));
      case SortType.RATING:
        console.log(`sort rating`)
        return filmCards
          .sort((a, b) => +b.filmInfo.totalRating - +a.filmInfo.totalRating);
    }
  }

  // главный метод для начала работы модуля
  _renderBoard() {
    // если фильмов нет
    const filmCards = this._getFilms();
    const filmCardsCount = filmCards.length;

    if (!filmCardsCount) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();

    render(this._mainElement, this._filmsBoardComponent);
    this._filmsBoard = this._mainElement.querySelector('.films');

    this._renderFilmsList();
  }

  _renderNoFilms() {
    render(this._mainElement, this._noFilmsComponent);
  }

  _renderSort() {
    render(this._mainElement, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _clearFilmsList() {
    console.log('clear film list')
    this._filmPresenters.forEach((presenter) => presenter._destroy());
    this._filmPresenters.clear();

    Object.values(this._filmPresentersExtra)
      .forEach((extra) => {
        extra.forEach((presenter) => presenter._destroy());
        extra.clear();
      });

    this._renderedFilmsCount = Films.FILMS_LOAD_MORE;
    removeComponent(this._showMoreBtnComponent);

    console.log(this._getFilms())
  }

  // [1]
  _renderFilmsList() {
    // render центрального контейнера для фильмов
    render(this._filmsBoard, this._filmsListComponent);

    const filmsListMain = this._filmsBoard.querySelector('.films-list--main');
    this._filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

    this._renderAllFilms(true);
  }

  // [2]
  _renderAllFilms(firstInit = false) {
    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, this._initCountFilms));

    this._renderFilms(this._filmsListMainContainer, films)
    this._renderExtraFilmsContainer(firstInit);

    // show more cards
    if (filmsCount > Films.FILMS_LOAD_MORE) {
      this._renderLoadMoreBtn();
    }
  }

  // [3]
  _renderFilms(container, films) {
    films.forEach(film => this._renderFilmPresenter(container, film))
  }

  // [4]
  _renderFilmPresenter(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmsUpdate); // принимает ф-цию update
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

    this._showMoreBtnComponent.setClickHandler(this._handleLoadMoreBtnClick);
  }

  // handlers ↓
  _handleSortTypeChange(target) {
    if (this._currentSortType === target.dataset.sortType) {
      console.log('AGA ! this._currentSortType === sortType')
      return;
    }

    this._currentSortType = target.dataset.sortType;

    this._clearFilmsList();
    this._renderAllFilms();
  }

  _handleLoadMoreBtnClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedTaskCount = Math.min(filmsCount, this._renderedFilmsCount + Films.FILMS_LOAD_MORE);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedTaskCount);

    this._renderFilms(this._filmsListMainContainer, films);
    this._renderedFilmsCount += Films.FILMS_LOAD_MORE;

    // удаление кнопки
    if (this._renderedFilmsCount >= this._getFilms().length) {
      this._showMoreBtnComponent.getElement().removeEventListener('click', this._handleLoadMoreBtnClick);
      removeComponent(this._showMoreBtnComponent);
    }
  }

  _handleFilmsUpdate(updatedFilm) {
    // Здесь будем вызывать обновление модели
    // Вызывается в Film презентер, принимает обновлённые данные

    // this._films = update(this._films, updatedFilm);
    // this._currentSortType = update(this._currentSortType, updatedFilm);
    // this._filmsExtra = getExtraTypeFilms(this._films);

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
