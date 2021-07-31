import {createRankTemplate} from './view/rank';
import {createFilterTemplate} from './view/filter';
import {createSortingTemplate} from './view/sorting';
import {createFilmsBoardTemplate} from './view/films-board';
import {createShowMoreTemplate} from './view/show-more';
import {createFilmCardTemplate} from './view/film-card';
import {createFilmDetailsTemplate} from './view/film-details';
import {createAllFilmsCountTemplate} from './view/all-films-count';

const SHOW_CARD_COUNT = 5;
const SHOW_CARD_EXTRA = 2;

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const pageBody = document.querySelector('body');
const siteHeaderElement = pageBody.querySelector('.header');
const siteMainElement = pageBody.querySelector('.main');
const siteFooterStatistics = pageBody.querySelector('.footer__statistics');

render(siteHeaderElement, createRankTemplate());
render(siteMainElement, createFilterTemplate());
render(siteMainElement, createSortingTemplate());
render(siteMainElement, createFilmsBoardTemplate());
render(siteFooterStatistics, createAllFilmsCountTemplate());
render(pageBody, createFilmDetailsTemplate());

const filmsBoard = siteMainElement.querySelector('.films');
const filmsListMain = filmsBoard.querySelector('.films-list--main');
const filmsListExtra = filmsBoard.querySelector('.films-list__container--extra');
const filmsListTop = filmsBoard.querySelector('.films-list__container--top');
const filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

render(filmsListMain, createShowMoreTemplate());

for (let i = 0; i < SHOW_CARD_COUNT; i++) {
  render(filmsListMainContainer, createFilmCardTemplate());
}

for (let i = 0; i < SHOW_CARD_EXTRA; i++) {
  render(filmsListExtra, createFilmCardTemplate());
  render(filmsListTop, createFilmCardTemplate());
}
