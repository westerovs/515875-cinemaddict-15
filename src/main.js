import { generateTask } from './mock/task.js';

import { createRankTemplate } from './view/rank';
import { createFilterTemplate } from './view/filter';
import { createSortingTemplate } from './view/sorting';
import { createFilmsBoardTemplate } from './view/films-board';
import { createShowMoreTemplate } from './view/show-more';
import { createFilmCardTemplate } from './view/film-card';
import { createFilmDetailsTemplate } from './view/film-details';
import { createAllFilmsCountTemplate } from './view/all-films-count';

const SHOW_CARD_COUNT = 10;
const SHOW_CARD_EXTRA = 2;

const tasksGenerateArr = new Array(SHOW_CARD_COUNT).fill('').map(() => generateTask());
const tasksExtraGenerateArr = new Array(SHOW_CARD_EXTRA).fill('').map(() => generateTask());

const taskFilmDetails = generateTask();

const render = (container, template, place = 'beforeend') => {
  if (container instanceof Element) {
    container.insertAdjacentHTML(place, template);
  }
};

const pageBody = document.querySelector('body');
const siteHeaderElement = pageBody.querySelector('.hader');
const siteMainElement = pageBody.querySelector('.main');
const siteFooterStatistics = pageBody.querySelector('.footer__statistics');

render(siteHeaderElement, createRankTemplate());
render(siteMainElement, createFilterTemplate());
render(siteMainElement, createSortingTemplate());
render(siteMainElement, createFilmsBoardTemplate());
render(siteFooterStatistics, createAllFilmsCountTemplate());
render(pageBody, createFilmDetailsTemplate(taskFilmDetails)); // popup

const filmsBoard = siteMainElement.querySelector('.films');
const filmsListMain = filmsBoard.querySelector('.films-list--main');
const filmsListExtra = filmsBoard.querySelector('.films-list__container--extra');
const filmsListTop = filmsBoard.querySelector('.films-list__container--top');
const filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

render(filmsListMain, createShowMoreTemplate());

tasksGenerateArr.forEach((task) => render(filmsListMainContainer, createFilmCardTemplate(task)));
tasksExtraGenerateArr.forEach((task) => {
  render(filmsListExtra, createFilmCardTemplate(task));
  render(filmsListTop, createFilmCardTemplate(task));
});
