import { generateFilm } from './mock/film.js';
import { toFiltersCount } from './mock/filter.js';
import { render } from './utils/utils.js';

import RankView from './view/rank.js';
import FilterView from './view/filter.js';
import SortingView from './view/sorting.js';
import FilmBoardView from './view/films-board.js';
import ShowMoreBtnView from './view/show-more.js';
import FilmCardView from './view/film-card.js';
// import FilmDetailsView from './view/film-details.js';
import FooterStatistic from './view/footer-statistic.js';

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

render(siteHeaderElement, new RankView().getElement());
render(siteMainElement, new FilterView(filters).getElement());
render(siteMainElement, new SortingView().getElement());

render(siteMainElement, new FilmBoardView().getElement());
render(siteFooterStatistics, new FooterStatistic(TOTAL_MOVIES).getElement());

// const filmDetails = generateFilm();
// render(pageBody, new FilmDetailsView(filmDetails).getElement());

const filmsBoard = siteMainElement.querySelector('.films');
const filmsListMain = filmsBoard.querySelector('.films-list--main');
const filmsListExtra = filmsBoard.querySelector('.films-list__container--extra');
const filmsListTop = filmsBoard.querySelector('.films-list__container--top');
const filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

const createFilms = () => {
  for (let i = 0; i < Math.min(SHOW_FILMS, films.length); i++) {
    render(filmsListMainContainer, new FilmCardView(films[i]).getElement());
  }
};

const createFilmsExtra = () => {
  filmsExtra.forEach((task) => {
    render(filmsListExtra, new FilmCardView(task).getElement());
    render(filmsListTop, new FilmCardView(task).getElement());
  });
};

createFilms();
createFilmsExtra();

// popup


// show more cards
if (films.length > SHOW_FILMS) {
  render(filmsListMain, new ShowMoreBtnView().getElement());

  const btnShowMore = filmsListMain.querySelector('.films-list__show-more');
  let currentPos = SHOW_FILMS;

  const showMoreCards = () => {
    films
      .slice(currentPos, currentPos + SHOW_FILMS)
      .forEach((task) => render(filmsListMainContainer, new FilmCardView(task).getElement()));

    currentPos += SHOW_FILMS;

    if (currentPos >= films.length)  {
      btnShowMore.removeEventListener('click', showMoreCards);
      btnShowMore.remove();
    }
  };

  btnShowMore.addEventListener('click', showMoreCards);
}

