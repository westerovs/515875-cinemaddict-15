/*
* главный презентер
* */

/* eslint-disable */
import dayjs from 'dayjs';
import { Films, SortType } from '../utils/const.js';
import { render, removeComponent } from '../utils/render.js'; // убрал метод updateItem
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
    this._filmModel = model; // - Переведем получение задач в презентере на модель.
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
    this._renderedFilmsCount = Films.FILMS_LOAD_MORE;

    this._handleLoadMoreBtnClick = this._handleLoadMoreBtnClick.bind(this);
    this._handleFilmsUpdate = this._handleFilmsUpdate.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    // убрал получение моков
    this._renderBoard();
    this._renderFilmsList();
  }

  // - В методе получения задач из модели опишем условие, чтобы учитывалась выбранная сортировка.
  // Теперь, если какой-то метод в нашем презентере захочет получить список задач из модели, он получит их в нужном порядке
  _getFilms() {
    // позволяет проводить манипуляции с задачами, какие нам нужны в презенторе в одном месте
    // Переведем получение задач в презентере на модель.
    // Теперь моки напрямую в презентере не используются, только модель
    const filmCards = this._filmModel.getFilms();
    this._filmsExtra = {
      topRated: getExtraTypeFilms(filmCards).topRated,
      mostCommented: getExtraTypeFilms(filmCards).mostCommented,
    };

    switch (this._currentSortType) {
      case SortType.DEFAULT:
        return this._filmModel.getFilms();
      case SortType.DATE:
        return filmCards
          .sort((a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date)));
      case SortType.RATING:
        return filmCards
          .sort((a, b) => +b.filmInfo.totalRating - +a.filmInfo.totalRating);
    }
  }

  // главный метод для начала работы модуля
  _renderBoard() {
    const filmCards = this._getFilms();
    const filmCardsCount = filmCards.length;

    // если фильмов нет
    if (!filmCardsCount) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();

    render(this._mainElement, this._filmsBoardComponent);
    this._filmsBoard = this._mainElement.querySelector('.films');
  }

  _renderNoFilms() {
    render(this._mainElement, this._noFilmsComponent);
  }

  _renderSort() {
    render(this._mainElement, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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
    console.log('!!! render all !!!');
    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, Films.SHOW_FILMS));

    this._renderFilms(this._filmsListMainContainer, films);
    this._renderExtraFilmsContainer(firstInit);

    // show more cards
    if (filmsCount > Films.FILMS_LOAD_MORE) {
      this._renderLoadMoreBtn();
    }
  }

  // [3]
  // Упростим метод _renderTasks: теперь он получает не диапазон,
  // а сразу массив задач, которые нужно отрендерить, потому что мы отказались от свойства this.films (моков)
  // и больше неоткуда брать задачи по диапазону
  _renderFilms(container, films) {
    films.forEach(film => this._renderFilmPresenter(container, film));
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
  _handleSortTypeChange(sortType) {
    this._currentSortType = sortType;

    this._clearFilmsList();
    this._renderAllFilms();
  }

  _handleLoadMoreBtnClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmsCount, this._renderedFilmsCount + Films.FILMS_LOAD_MORE);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);

    this._renderFilms(this._filmsListMainContainer, films);
    this._renderedFilmsCount = newRenderedFilmCount;

    // удаление кнопки
    if (this._renderedFilmsCount >= filmsCount) {
      this._showMoreBtnComponent.getElement().removeEventListener('click', this._handleLoadMoreBtnClick);
      removeComponent(this._showMoreBtnComponent);
    }
  }

  _handleFilmsUpdate(updatedFilm) {
    // аналог _handleTaskChange
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

  _clearFilmsList() {
    this._filmPresenters.forEach((presenter) => presenter._destroy());
    this._filmPresenters.clear();

    Object.values(this._filmPresentersExtra).forEach((extra) => {
      extra.forEach((presenter) => presenter._destroy());
      extra.clear();
    });

    this._renderedFilmsCount = Films.FILMS_LOAD_MORE;
    removeComponent(this._showMoreBtnComponent);
  }

  // updateType - жучок
  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    // обрабатывает события на вьюхе, он будет вызывать updateFilm
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные

  }

  // обработчик-наблюдатель который будет реагировать на изменения модели
  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  }
}
