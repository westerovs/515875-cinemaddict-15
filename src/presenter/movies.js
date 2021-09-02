/*
* главный презентер
* */
import dayjs from 'dayjs';
import { Films } from '../utils/const.js';
import { render, removeComponent, update } from '../utils/render.js';

import FilmPresenter from './film.js';
import SortView from '../view/sort.js';
import FilmsBoardView from '../view/film-board.js';
import FilmsListView from '../view/films-list.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import ShowMoreBtnView from '../view/show-more-btn.js';
import NoFilmsView from '../view/no-films.js';

export default class Movies {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    // ↓ запоминаем все созданные презентеры ↓
    this.filmPresenters = new Map();
    this.filmPresentersExtra = {
      topRated: new Map(),
      mostCommented: new Map(),
    };

    this._sortComponent = new SortView();
    this._filmsBoardComponent = new FilmsBoardView();
    this._filmsListComponent = new FilmsListView();
    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._noFilmsComponent = new NoFilmsView();

    this.initCountFilms = Films.SHOW_FILMS;
    this.visibleFilms = Films.FILMS_LOAD;
    this.renderedFilmsCount = Films.FILMS_LOAD;

    this.films = null;
    this.filmsExtra = null;
    this.filmsBoard = null;
    this.filmsListMainContainer = null;
    this.defaultSort = null;

    this._handlerLoadMoreBtnClick = this._handlerLoadMoreBtnClick.bind(this);
    this._handlerFilmsUpdate = this._handlerFilmsUpdate.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films, filmsExtra) {
    this.films = films.slice();
    this.filmsExtra = filmsExtra;
    this.defaultSort = films.slice();

    this._renderBoard();
  }

  // главный метод для начала работы модуля
  _renderBoard() {
    // если фильмов нет
    if (!this.films.length) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    this._renderFilmContainer();
  }

  _renderNoFilms() {
    // метод для рендеринга заглушки
    render(this._filmsContainer, this._noFilmsComponent);
  }

  _renderSort() {
    render(this._filmsContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(target) {
    // - Очищаем список
    this.filmPresenters.forEach((presenter) => presenter._destroyAll());
    // - Очищаем экстра список
    Object.values(this.filmPresentersExtra).forEach((extra) =>
      extra.forEach((presenter) => presenter._destroyAll()));

    switch (target.dataset.sortType) {
      case 'default':
        this.films = this.defaultSort.slice();
        break;
      case 'date':
        this.films.sort((a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date)));
        break;
      case 'rating':
        this.films.sort((a, b) => +b.filmInfo.totalRating - +a.filmInfo.totalRating);
        break;
    }

    this._renderAllFilms();
    this._renderFilmsListExtra();
  }

  _renderFilmContainer() {
    // render доски фильмов
    render(this._filmsContainer, this._filmsBoardComponent);
    const filmsBoard = this._filmsContainer.querySelector('.films');
    this.filmsBoard = filmsBoard;

    // render центрального контейнера для фильмов
    render(this.filmsBoard, this._filmsListComponent);
    const filmsListMain = filmsBoard.querySelector('.films-list--main');
    this.filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

    this._renderAllFilms();
    this._renderFilmsListExtra(true);

    // show more cards
    if (this.films.length > Films.FILMS_LOAD) {
      this._renderLoadMoreBtn(filmsListMain);
    }
  }

  _renderFilmsFromTo(container, from , to) {
    // Метод для отрисовки группы фильмов за раз
    this.films
      .slice(from, to)
      .forEach((film) => this._renderFilmPresenter(container, film));
  }

  _renderFilmPresenter(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handlerFilmsUpdate); // принимает ф-цию update
    filmPresenter.init(film);

    this.filmPresenters.set(film.id, filmPresenter); // в map записывает ключ: id и film
    this.filmPresentersExtra.topRated.set(film.id, filmPresenter); // в map записывает ключ: id и film
    this.filmPresentersExtra.mostCommented.set(film.id, filmPresenter); // в map записывает ключ: id и film
  }

  _renderAllFilms(firstInit = false) {
    // рендерит число указанное в константе
    if (firstInit) {
      this._renderFilmsFromTo(this.filmsListMainContainer, 0, Math.min(this.initCountFilms, this.films.length));
      return;
    }
    // рендерит текущее число видимых (когда открыто много карточек и мы сортируем, что бы не схлопывалось)
    this._renderFilmsFromTo(this.filmsListMainContainer, 0,  Math.min(this.visibleFilms, this.films.length));
  }

  _renderFilmsListExtra(firstInit = false) {
    if (this.filmsExtra.topRated.some((film) => +film.filmInfo.totalRating !== 0)) {
      if (firstInit) {
        render(this.filmsBoard, new FilmsListExtraView('Top rated', 'rated'));
      }
      this._renderExtraFilms('Top rated', 'rated');
    }
    if (this.filmsExtra.mostCommented.some((film) => film.comments.size !== 0)) {
      if (firstInit) {
        render(this.filmsBoard, new FilmsListExtraView('Most commented', 'commented'));
      }
      this._renderExtraFilms('Most commented', 'commented');
    }
  }

  _renderExtraFilms(name, type) {
    const filmListExtraContainer = this.filmsBoard.querySelector(`*[data-extra-type="${ type }"]`);

    switch (name) {
      case 'Top rated':
        this.filmsExtra.topRated.forEach((film) => {
          const filmPresenter = new FilmPresenter(filmListExtraContainer, this._handlerFilmsUpdate);
          filmPresenter.init(film);
          this.filmPresentersExtra.topRated.set(film.id, filmPresenter);
        });
        break;

      case 'Most commented':
        this.filmsExtra.mostCommented.forEach((film) => {
          const filmPresenter = new FilmPresenter(filmListExtraContainer, this._handlerFilmsUpdate);
          filmPresenter.init(film);
          this.filmPresentersExtra.mostCommented.set(film.id, filmPresenter);
        });
        break;
    }
  }

  _renderLoadMoreBtn(filmsList) {
    render(filmsList, this._showMoreBtnComponent);
    this._showMoreBtnComponent.setClickHandler(this._handlerLoadMoreBtnClick);
  }

  _handlerLoadMoreBtnClick() {
    this._renderFilmsFromTo(this.filmsListMainContainer, this.renderedFilmsCount, this.renderedFilmsCount + Films.FILMS_LOAD);
    this.renderedFilmsCount += Films.FILMS_LOAD;
    this.visibleFilms = this.filmsListMainContainer.childElementCount;

    // удаление кнопки
    if (this.renderedFilmsCount >= this.films.length) {
      this._showMoreBtnComponent.getElement().removeEventListener('click', this._handlerLoadMoreBtnClick);
      removeComponent(this._showMoreBtnComponent);
    }
  }

  // Вызывается в Film презентер, принимает обновлённые данные
  _handlerFilmsUpdate(updatedFilm) {
    // при вызове метода, будет реагировать на изменения контроллов карточки фильма
    this.films = update(this.films, updatedFilm); // обновляет список фильмов, или возвращает как есть
    this.filmPresenters.get(updatedFilm.id).init(updatedFilm);
    this.filmPresentersExtra.topRated.get(updatedFilm.id).init(updatedFilm);
    this.filmPresentersExtra.mostCommented.get(updatedFilm.id).init(updatedFilm);
  }
}
