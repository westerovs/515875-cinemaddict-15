import { render, removeComponent, update } from '../utils/render.js';

import FilmPresenter from './film.js';

import SortView from '../view/sort.js';
import FilmsBoardView from '../view/film-board.js';
import FilmsListView from '../view/films-list.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import ShowMoreBtnView from '../view/show-more-btn.js';
import NoFilmsView from '../view/no-films.js';

const SHOW_FILMS = 5;

export default class Movies {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this.filmPresenters = new Map(); // запоминаем все созданные презентеры

    this._sortComponent        = new SortView();
    this._filmsBoardComponent  = new FilmsBoardView();
    this._filmsListComponent   = new FilmsListView();
    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._noFilmsComponent     = new NoFilmsView();

    this.films = null;
    this.filmsExtra = {};
    this.renderedFilmsCount = SHOW_FILMS;
    this.filmsListMainContainer = null;

    this._handlerLoadMoreBtnClick = this._handlerLoadMoreBtnClick.bind(this);
    this._handlerFilmsUpdate = this._handlerFilmsUpdate.bind(this);
  }

  init(films, filmsExtra) {
    this.films = films.slice();
    this.filmsExtra = {
      topRated: filmsExtra.topRated.slice(),
      mostCommented :filmsExtra.mostCommented.slice() ,
    };

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
  }

  _renderFilmContainer() {
    // render доски фильмов
    render(this._filmsContainer, this._filmsBoardComponent);
    const filmsBoard = this._filmsContainer.querySelector('.films');

    // render центрального контейнера для фильмов
    render(filmsBoard, this._filmsListComponent);
    const filmsListMain = filmsBoard.querySelector('.films-list--main');
    this.filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

    this._renderAllFilms();
    this._renderFilmsExtra(filmsBoard, 'Top rated');
    this._renderFilmsExtra(filmsBoard, 'Most commented');

    // show more cards
    if (this.films.length > SHOW_FILMS) {
      this._renderLoadMoreBtn(filmsListMain);
    }
  }

  _renderFilmsFromTo(container, from , to) {
    // Метод для отрисовки группы фильмов за раз
    this.films
      .slice(from, to)
      .forEach((film) => this._renderFilmPresenter(container, film));
  }

  _renderFilmPresenter(filmContainer, film) {
    const filmPresenter = new FilmPresenter(filmContainer, this._handlerFilmsUpdate); // принимает ф-цию update
    filmPresenter.init(film);

    this.filmPresenters.set(film.id, filmPresenter); // в map записывает ключ: id и film
  }

  _renderAllFilms() {
    this._renderFilmsFromTo(this.filmsListMainContainer, 0, Math.min(SHOW_FILMS, this.films.length));
  }

  _renderFilmsExtra(container, type) {
    const filmListExtraComponent = new FilmsListExtraView(type);
    render(container, filmListExtraComponent);

    const filmListExtraContainer = filmListExtraComponent.getElement().querySelector('.films-list__container');

    switch (type) {
      case 'Top rated':
        this.filmsExtra.topRated.forEach((film) => this._renderFilmPresenter(filmListExtraContainer, film));
        break;
      case 'Most commented':
        this.filmsExtra.mostCommented.forEach((film) => this._renderFilmPresenter(filmListExtraContainer, film));
        break;
    }
  }

  _renderLoadMoreBtn(filmsList) {
    render(filmsList, this._showMoreBtnComponent);

    this._showMoreBtnComponent.setClickHandler(this._handlerLoadMoreBtnClick);
  }

  _handlerLoadMoreBtnClick() {
    this._renderFilmsFromTo(this.filmsListMainContainer, this.renderedFilmsCount, this.renderedFilmsCount + SHOW_FILMS);

    this.renderedFilmsCount += SHOW_FILMS;

    // удаление кнопки
    if (this.renderedFilmsCount >= this.films.length) {
      this._showMoreBtnComponent.getElement().removeEventListener('click', this._handlerLoadMoreBtnClick);
      removeComponent(this._showMoreBtnComponent);
    }
  }

  // Вызывается в Film презентер, принимает обновлённые данные
  _handlerFilmsUpdate(updatedFilm) {
    // при вызове метода, будет реагировать на изменения контроллов карточки фильма
    // как только изменились данные, нужно изменить представление
    this.films = update(this.films, updatedFilm); // обновляет список фильмов, или возвращает как есть
    this.filmPresenters.get(updatedFilm.id).init(updatedFilm); // перерисовываем данные
  }
}
