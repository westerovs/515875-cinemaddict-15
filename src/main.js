import { generateFilm } from './mock/film.js';
import { toFiltersCount } from './mock/filter.js';
import { render } from './utils/utils.js';

import { createRankTemplate } from './view/rank';
import { createFilterTemplate } from './view/filter';
import { createSortingTemplate } from './view/sorting';
import { createFilmsBoardTemplate } from './view/films-board';
import { createShowMoreTemplate } from './view/show-more';
import { createFilmCardTemplate } from './view/film-card';
import { createFilmDetailsTemplate } from './view/film-details';
import { createAllFilmsCountTemplate } from './view/all-films-count';

const FILM_COUNT = 20;
const SHOW_FILMS = 5;
const SHOW_FILMS_EXTRA = 2;
const TOTAL_MOVIES = 9999;

const films = new Array(FILM_COUNT)
  .fill('')
  .map((_, i) => generateFilm(i + 1));

const filmsExtra = new Array(SHOW_FILMS_EXTRA)
  .fill('')
  .map(generateFilm);
const filters = toFiltersCount(films);

const pageBody = document.querySelector('body');
const siteHeaderElement = pageBody.querySelector('.header');
const siteMainElement = pageBody.querySelector('.main');
const siteFooterStatistics = pageBody.querySelector('.footer__statistics');

render(siteHeaderElement, createRankTemplate());
render(siteMainElement, createFilterTemplate(filters));
render(siteMainElement, createSortingTemplate());
render(siteMainElement, createFilmsBoardTemplate());
render(siteFooterStatistics, createAllFilmsCountTemplate(TOTAL_MOVIES));

// popup
const taskFilmDetails = generateFilm();
render(pageBody, createFilmDetailsTemplate(taskFilmDetails));

const filmsBoard = siteMainElement.querySelector('.films');
const filmsListMain = filmsBoard.querySelector('.films-list--main');
const filmsListExtra = filmsBoard.querySelector('.films-list__container--extra');
const filmsListTop = filmsBoard.querySelector('.films-list__container--top');
const filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

// render cards
for (let i = 0; i < Math.min(SHOW_FILMS, films.length); i++) {
  render(filmsListMainContainer, createFilmCardTemplate(films[i]));
}

// render extra
filmsExtra.forEach((task) => {
  render(filmsListExtra, createFilmCardTemplate(task));
  render(filmsListTop, createFilmCardTemplate(task));
});

// show more cards
if (films.length > SHOW_FILMS) {
  render(filmsListMain, createShowMoreTemplate());

  const btnShowMore = filmsListMain.querySelector('.films-list__show-more');
  let currentPos = SHOW_FILMS;

  const showMoreCards = () => {
    films
      .slice(currentPos, currentPos + SHOW_FILMS)
      .forEach((task) => render(filmsListMainContainer, createFilmCardTemplate(task)));

    currentPos += SHOW_FILMS;

    if (currentPos >= films.length)  {
      btnShowMore.removeEventListener('click', showMoreCards);
      btnShowMore.remove();
    }
  };

  btnShowMore.addEventListener('click', showMoreCards);
}

