/* eslint-disable */

import { render } from '../utils/render.js';

import SortingView from '../view/sort.js';
import FilmsBoardView from '../view/film-board.js';
import FilmsListView from '../view/films-list.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import ShowMoreBtnView from '../view/show-more-btn.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import NoFilmsView from '../view/no-films.js';

/*
*  Конструктор презентера должен принимать необходимые данные.
*
*  Разнесите по презентерам всю логику по отрисовке фильмов и кнопки «Show more»,
*  а также по навешиванию на них обработчиков, из main.js.
*
*  В main.js создайте экземпляры презентеров, передайте данные и инициализируйте их.
* */

const SHOW_FILMS = 5;

export default class Movies {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;

    this._sortComponent = new SortingView;
    this._boardComponent = new FilmsBoardView;
    this._filmsListComponent = new FilmsListView;
    this._filmListExtraComponent = new FilmsListExtraView;
    this._showMoreComponent = new ShowMoreBtnView;
    this._filmCardComponent = new FilmCardView;
    this._filmCardDetailsComponent = new FilmDetailsView;
    this._noFilmsComponent = new NoFilmsView;

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

  _renderFilms(container) {
    // Метод для отрисовки группы фильмов за раз
    for (let i = 0; i < Math.min(SHOW_FILMS, this.films.length); i++) {
      this._renderFilm(container, this.films[i]);
    }
  }

  _renderFilmsExtra(container, title) {
    const filmListExtra = new FilmsListExtraView(title);
    render(container, filmListExtra);

    const filmListExtraContainer = filmListExtra.getElement().querySelector('.films-list__container');
    this.filmsExtra.forEach((film) => this._renderFilm(filmListExtraContainer, film));
  }

  _renderFilmsBoard() {
    this._renderSort();
    render(this._filmsContainer, this._boardComponent);

    const filmsBoard = this._filmsContainer.querySelector('.films');
    render(filmsBoard, this._filmsListComponent);

    const filmsListMain = filmsBoard.querySelector('.films-list--main');
    const filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

    this._renderFilms(filmsListMainContainer);
    this._renderFilmsExtra(filmsBoard, 'Top rated');
    this._renderFilmsExtra(filmsBoard, 'Most commented');

    this._renderLoadMoreButton(filmsListMain, filmsListMainContainer);
  }

  renderNoFilms() {
    render(this._filmsContainer, this._noFilmsComponent);
  }

  _renderLoadMoreButton(filmsListMain, filmsListMainContainer) {
    // show more cards
    if (this.films.length > SHOW_FILMS) {
      const btnShowMoreComponent = this._showMoreComponent;
      render(filmsListMain, btnShowMoreComponent);

      let currentPos = SHOW_FILMS;

      const showMoreCards = () => {
        this.films
          .slice(currentPos, currentPos + SHOW_FILMS)
          .forEach((film) => this._renderFilm(filmsListMainContainer, film));

        currentPos += SHOW_FILMS;

        if (currentPos >= this.films.length)  {
          btnShowMoreComponent.getElement().removeEventListener('click', showMoreCards);
          btnShowMoreComponent.removeElement();
        }
      };

      btnShowMoreComponent.setClickHandler(showMoreCards);
    }
  }

  init(films, filmsExtra) {
    this.films = films;
    this.filmsExtra = filmsExtra;

    this._renderFilmsBoard();
  }
}
