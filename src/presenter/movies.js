/* eslint-disable */

import { render } from '../utils/render.js';

import SortView from '../view/sort.js';
import FilmsBoardView from '../view/film-board.js';
import FilmsListView from '../view/films-list.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import ShowMoreBtnView from '../view/show-more-btn.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import NoFilmsView from '../view/no-films.js';

const SHOW_FILMS = 5;

export default class Movies {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;

    this._sortComponent = new SortView();
    this._filmsBoardComponent = new FilmsBoardView();
    this._filmsListComponent = new FilmsListView();
    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._noFilmsComponent = new NoFilmsView();

    this.films = null;
    this.filmsExtra = null;
  }

  _renderSort() {
    render(this._filmsContainer, this._sortComponent);
  }

  _renderFilmEdit(film) {
    const filmEditComponent = new FilmDetailsView(film);

    document.body.appendChild(filmEditComponent.getElement());
    document.body.classList.add('hide-overflow');

    const closeFilmDetails = () => {
      document.body.removeChild(filmEditComponent.getElement());
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    };

    function onEscKeyDown (evt) {
      if (evt.code === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closeFilmDetails();
      }
    }

    document.addEventListener('keydown', onEscKeyDown );

    filmEditComponent.setClickHandler(closeFilmDetails);
  }

  _renderFilm(filmListElement, film) {
    const filmComponent = new FilmCardView(film);
    filmComponent.setClickHandler(this._renderFilmEdit);

    render(filmListElement, filmComponent);
  }

  _renderFilmsGroup(container, from , to) {
    // Метод для отрисовки группы фильмов за раз
    this.films
      .slice(from, to)
      .forEach((film) => this._renderFilm(container, film));
  }

  _renderFilmContainer() {
    // render доски фильмов
    render(this._filmsContainer, this._filmsBoardComponent);
    const filmsBoard = this._filmsContainer.querySelector('.films');

    // render контейнера для фильмов
    render(filmsBoard, this._filmsListComponent);
    const filmsListMain = filmsBoard.querySelector('.films-list--main');
    const filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

    this._renderFilmsGroup(filmsListMainContainer, 0, Math.min(SHOW_FILMS, this.films.length));
    this._renderFilmsExtra(filmsBoard, 'Top rated');
    this._renderFilmsExtra(filmsBoard, 'Most commented');

    // show more cards
    if (this.films.length > SHOW_FILMS) {
      this._renderLoadMoreButton(filmsListMain, filmsListMainContainer);
    }
  }

  _renderNoFilms() {
    // метод для рендеринга заглушки
    render(this._filmsContainer, this._noFilmsComponent);
  }

  _renderFilmsExtra(container, title) {
    const filmListExtra = new FilmsListExtraView(title);
    render(container, filmListExtra);

    const filmListExtraContainer = filmListExtra.getElement().querySelector('.films-list__container');
    this.filmsExtra.forEach((film) => this._renderFilm(filmListExtraContainer, film));
  }

  // метод для инициализации начала работы модуля
  _renderBoard() {
    // если фильмов нет
    if (!this.films.length) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    this._renderFilmContainer();
  }

  _renderLoadMoreButton(filmsList, filmsListMainContainer) {
    const btnShowMoreComponent = this._showMoreBtnComponent;
    render(filmsList, btnShowMoreComponent);

    // !!! нужно знать сколько уже отрисовано
    let currentPos = SHOW_FILMS;

    const showMoreCards = () => {
      this._renderFilmsGroup(filmsListMainContainer, currentPos, currentPos + SHOW_FILMS);

      currentPos += SHOW_FILMS;

      // удаление кнопки
      if (currentPos >= this.films.length) {
        btnShowMoreComponent.getElement().removeEventListener('click', showMoreCards);
        btnShowMoreComponent.removeElement();
      }
    };

    btnShowMoreComponent.setClickHandler(showMoreCards);
  }

  init(films, filmsExtra) {
    this.films = films.slice();
    this.filmsExtra = filmsExtra.slice();

    this._renderBoard()
  }
}
