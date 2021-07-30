import {createRankTemplate} from './view/rank.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortingTemplate} from './view/sorting.js';
import {createFilmsBoardTemplate} from './view/filmsBoard.js';
import {createShowMoreTemplate} from './view/showMore.js';
import {createFilmCardTemplate} from './view/filmCard.js';
import {createAllFilmsCount} from './view/allfilmsCount.js';

const SHOW_CARD_COUNT = 5;
const SHOW_CARD_EXTRA = 2;

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatistics = document.querySelector('.footer__statistics');

render(siteHeaderElement, createRankTemplate());
render(siteMainElement, createFilterTemplate());
render(siteMainElement, createSortingTemplate());
render(siteMainElement, createFilmsBoardTemplate());
render(siteFooterStatistics, createAllFilmsCount());

const filmsBoard = siteMainElement.querySelector('.films');
const filmsListMain = filmsBoard.querySelector('.films-list--main');
const filmsListExtra = filmsBoard.querySelector('.films-list__container--extra');
const filmsListTop = filmsBoard.querySelector('.films-list__container--top');
const filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

for (let i = 0; i < SHOW_CARD_COUNT; i++) {
  render(filmsListMainContainer, createFilmCardTemplate());
}

for (let i = 0; i < SHOW_CARD_EXTRA; i++) {
  render(filmsListExtra, createFilmCardTemplate());
  render(filmsListTop, createFilmCardTemplate());
}

render(filmsListMain, createShowMoreTemplate());

