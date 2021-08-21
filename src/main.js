import { generateFilm } from './mock/film.js';
import { toFiltersCount } from './mock/filter.js';
import { render } from './utils/render.js';

import MoviesPresenter from './presenter/movies.js';
import RankView from './view/rank.js';
import FilterView from './view/filter.js';
import SortingView from './view/sort.js';
import FilmsBoardView from './view/film-board.js';
import FilmsListView from './view/films-list.js';
import FilmsListExtraView from './view/films-list-extra.js';
import ShowMoreBtnView from './view/show-more-btn.js';
import FilmCardView from './view/film-card.js';
import FilmDetailsView from './view/film-details.js';
import FooterStatistic from './view/footer-statistic.js';
import NoFilms from './view/no-films.js';

const FILM_COUNT = 20;
const SHOW_FILMS = 5;
const SHOW_FILMS_EXTRA = 2;
const TOTAL_MOVIES = 9999;

const films = new Array(FILM_COUNT).fill('').map(() => generateFilm());
const filmsExtra = new Array(SHOW_FILMS_EXTRA).fill('').map(generateFilm);
const filters = toFiltersCount(films);

const pageBody = document.querySelector('body');
const siteHeaderElement = pageBody.querySelector('.header');
const siteMainElement = pageBody.querySelector('.main');
const siteFooterStatistics = pageBody.querySelector('.footer__statistics');

render(siteHeaderElement, new RankView());
render(siteMainElement, new FilterView(filters));
render(siteFooterStatistics, new FooterStatistic(TOTAL_MOVIES));

const renderFilmEdit = (film) => {
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
};

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmCardView(film);

  filmComponent.setClickHandler(renderFilmEdit);

  render(filmListElement, filmComponent);
};

const renderFilmsBoard = () => {
  render(siteMainElement, new SortingView());
  render(siteMainElement, new FilmsBoardView());

  const filmsBoard = siteMainElement.querySelector('.films');
  render(filmsBoard, new FilmsListView());

  const filmsListMain = filmsBoard.querySelector('.films-list--main');
  const filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

  const renderFilms = () => {
    for (let i = 0; i < Math.min(SHOW_FILMS, films.length); i++) {
      renderFilm(filmsListMainContainer, films[i]);
    }

    const renderExtraFilms = (title) => {
      const filmListExtra = new FilmsListExtraView(title);
      render(filmsBoard, filmListExtra);

      const filmListExtraContainer = filmListExtra.getElement().querySelector('.films-list__container');
      filmsExtra.forEach((film) => renderFilm(filmListExtraContainer, film));
    };

    renderExtraFilms('Top rated');
    renderExtraFilms('Most commented');
  };

  // show more cards
  if (films.length > SHOW_FILMS) {
    const btnShowMoreComponent = new ShowMoreBtnView();
    render(filmsListMain, btnShowMoreComponent);

    let currentPos = SHOW_FILMS;

    const showMoreCards = () => {
      films
        .slice(currentPos, currentPos + SHOW_FILMS)
        .forEach((film) => renderFilm(filmsListMainContainer, film));

      currentPos += SHOW_FILMS;

      if (currentPos >= films.length)  {
        btnShowMoreComponent.getElement().removeEventListener('click', showMoreCards);
        btnShowMoreComponent.removeElement();
      }
    };

    btnShowMoreComponent.setClickHandler(showMoreCards);
  }

  renderFilms();
};

const moviesPresenter = new MoviesPresenter(siteMainElement);

if (!films.length) {
  render(siteMainElement, new NoFilms());
} else {
  // renderFilmsBoard();
  moviesPresenter.init(films, filmsExtra);
}

