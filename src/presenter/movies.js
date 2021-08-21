/* eslint-disable */

import { generateFilm } from '../mock/film.js';
import { toFiltersCount } from '../mock/filter.js';
import { render } from '../utils/render.js';

import filmBoardView from '../view/film-board.js';
import RankView from '../view/rank.js';
import FilterView from '../view/filter.js';
import SortingView from '../view/sort.js';
import FilmsBoardView from '../view/film-board.js';
import FilmsListView from '../view/films-list.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import ShowMoreBtnView from '../view/show-more-btn.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import FooterStatistic from '../view/footer-statistic.js';
import NoFilms from '../view/no-films.js';

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
    this._boardComponent = filmBoardView;
    this.films = null;
    this.filmsExtra = null;
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    render(this._filmsContainer, new SortingView());
  }

  _renderFilmEdit(film) {
    console.log('renderFilmEdit...');

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
    console.log('renderFilmsBoard...');

    this._renderSort()
    render(this._filmsContainer, new FilmsBoardView());

    const filmsBoard = this._filmsContainer.querySelector('.films');
    render(filmsBoard, new FilmsListView());

    const filmsListMain = filmsBoard.querySelector('.films-list--main');
    const filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

    this._renderFilms(filmsListMainContainer)
    this._renderFilmsExtra(filmsBoard, 'Top rated');
    this._renderFilmsExtra(filmsBoard, 'Most commented');

    this._renderLoadMoreButton(filmsListMain, filmsListMainContainer)
  }

  renderNoFilms() {
    render(this._filmsContainer, new NoFilms());
  }

  _renderLoadMoreButton(filmsListMain, filmsListMainContainer) {
    // show more cards
    if (this.films.length > SHOW_FILMS) {
      const btnShowMoreComponent = new ShowMoreBtnView();
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
