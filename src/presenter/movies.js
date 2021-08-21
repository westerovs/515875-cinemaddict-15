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

  _renderFilmEdit() {
    console.log('renderFilmEdit...');
  }

  _renderFilm(filmListElement, film) {
    const filmComponent = new FilmCardView(film);
    filmComponent.setClickHandler(this._renderFilmEdit);

    render(filmListElement, filmComponent);
  }

  _renderFilms(container) {
    // Метод для отрисовки группы фильмов за раз
    console.log('renderFilmsBoard...');

    for (let i = 0; i < Math.min(SHOW_FILMS, this.films.length); i++) {
      this._renderFilm(container, this.films[i]);
    }

    // const renderExtraFilms = (title) => {
    //   const filmListExtra = new FilmsListExtraView(title);
    //   render(filmsBoard, filmListExtra);
    //
    //   const filmListExtraContainer = filmListExtra.getElement().querySelector('.films-list__container');
    //   this.filmsExtra.forEach((film) => this._renderFilm(filmListExtraContainer, film));
    // };
    //
    // renderExtraFilms('Top rated');
    // renderExtraFilms('Most commented');
  }

  _renderFilmsExtra(container, title) {
    const filmListExtra = new FilmsListExtraView(title);
    render(container, filmListExtra);

    const filmListExtraContainer = filmListExtra.getElement().querySelector('.films-list__container');
    this.filmsExtra.forEach((film) => this._renderFilm(filmListExtraContainer, film));

    // renderExtraFilms('Top rated');
    // renderExtraFilms('Most commented');
  }


  _renderFilmsBoard() {
    console.log('renderFilmsBoard...');

    this._renderSort()
    render(this._filmsContainer, new FilmsBoardView());

    const filmsBoard = this._filmsContainer.querySelector('.films');
    render(filmsBoard, new FilmsListView());

    const filmsListMain = filmsBoard.querySelector('.films-list--main');
    const filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

    // show more cards
    // if (films.length > SHOW_FILMS) {
    //   const btnShowMoreComponent = new ShowMoreBtnView();
    //   render(filmsListMain, btnShowMoreComponent);
    //
    //   let currentPos = SHOW_FILMS;
    //
    //   const showMoreCards = () => {
    //     films
    //       .slice(currentPos, currentPos + SHOW_FILMS)
    //       .forEach((film) => renderFilm(filmsListMainContainer, film));
    //
    //     currentPos += SHOW_FILMS;
    //
    //     if (currentPos >= films.length)  {
    //       btnShowMoreComponent.getElement().removeEventListener('click', showMoreCards);
    //       btnShowMoreComponent.removeElement();
    //     }
    //   };
    //
    //   btnShowMoreComponent.setClickHandler(showMoreCards);
    // }
    //

    this._renderFilms(filmsListMainContainer)
    this._renderFilmsExtra(filmsBoard, 'Top rated');
    this._renderFilmsExtra(filmsBoard, 'Most commented');
  }

  _renderNoFilms() {
    // Метод для рендеринга заглушки
  }

  _renderLoadMoreButton() {
    // Метод, куда уйдёт логика по отрисовке кнопки допоказа задач,
    // сейчас в main.js является частью renderBoard
  }

  init(films, filmsExtra) {
    this.films = films;
    this.filmsExtra = filmsExtra;

    this._renderFilmsBoard();
  }
}
