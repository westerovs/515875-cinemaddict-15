import { generateFilm } from './mock/film';
import { toFiltersCount } from './mock/filter';
import { renderElement } from './utils/utils';

import RankView from './view/rank';
import FilterView from './view/filter';
import SortingView from './view/sorting';
import FilmBoardView from './view/films-board';
import ShowMoreBtnView from './view/show-more';
import FilmCardView from './view/film-card';
import FilmDetailsView from './view/film-details';
import FooterStatistic from './view/footer-statistic';

const FILM_COUNT = 20;
const SHOW_FILMS = 5;
const SHOW_FILMS_EXTRA = 2;
const TOTAL_MOVIES = 9999;

const films = new Array(FILM_COUNT).fill('').map((_, i) => generateFilm(i + 1));
const filmsExtra = new Array(SHOW_FILMS_EXTRA).fill('').map(generateFilm);
const filters = toFiltersCount(films);

const pageBody = document.querySelector('body');
const siteHeaderElement = pageBody.querySelector('.header');
const siteMainElement = pageBody.querySelector('.main');
const siteFooterStatistics = pageBody.querySelector('.footer__statistics');

renderElement(siteHeaderElement, new RankView().getElement());
renderElement(siteMainElement, new FilterView(filters).getElement());
renderElement(siteMainElement, new SortingView().getElement());

renderElement(siteMainElement, new FilmBoardView().getElement());
renderElement(siteFooterStatistics, new FooterStatistic(TOTAL_MOVIES).getElement());

// popup
const filmDetails = generateFilm();
renderElement(pageBody, new FilmDetailsView(filmDetails).getElement());

const filmsBoard = siteMainElement.querySelector('.films');
const filmsListMain = filmsBoard.querySelector('.films-list--main');
const filmsListExtra = filmsBoard.querySelector('.films-list__container--extra');
const filmsListTop = filmsBoard.querySelector('.films-list__container--top');
const filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

// renderElement cards
for (let i = 0; i < Math.min(SHOW_FILMS, films.length); i++) {
  renderElement(filmsListMainContainer, new FilmCardView(films[i]).getElement());
}

// renderElement extra
filmsExtra.forEach((task) => {
  renderElement(filmsListExtra, new FilmCardView(task).getElement());
  renderElement(filmsListTop, new FilmCardView(task).getElement());
});

// show more cards
if (films.length > SHOW_FILMS) {
  renderElement(filmsListMain, new ShowMoreBtnView().getElement());

  const btnShowMore = filmsListMain.querySelector('.films-list__show-more');
  let currentPos = SHOW_FILMS;

  const showMoreCards = () => {
    films
      .slice(currentPos, currentPos + SHOW_FILMS)
      .forEach((task) => renderElement(filmsListMainContainer, new FilmCardView(task).getElement()));

    currentPos += SHOW_FILMS;

    if (currentPos >= films.length)  {
      btnShowMore.removeEventListener('click', showMoreCards);
      btnShowMore.remove();
    }
  };

  btnShowMore.addEventListener('click', showMoreCards);
}

