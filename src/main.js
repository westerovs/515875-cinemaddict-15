import { generateTask } from './mock/task.js';
import { toFiltersCount } from './mock/filter.js';
import { render } from './utils.js';

import { createRankTemplate } from './view/rank';
import { createFilterTemplate } from './view/filter';
import { createSortingTemplate } from './view/sorting';
import { createFilmsBoardTemplate } from './view/films-board';
import { createShowMoreTemplate } from './view/show-more';
import { createFilmCardTemplate } from './view/film-card';
// import { createFilmDetailsTemplate } from './view/film-details';
import { createAllFilmsCountTemplate } from './view/all-films-count';

const TASK_ALL_COUNT = 20;
const SHOW_CARD = 5;
const SHOW_CARD_EXTRA = 2;

const tasks = new Array(TASK_ALL_COUNT).fill('').map((_, i) => generateTask(i + 1));
const tasksExtraGenerateArr = new Array(SHOW_CARD_EXTRA).fill('').map(generateTask);
const filters = toFiltersCount(tasks);

const pageBody = document.querySelector('body');
const siteHeaderElement = pageBody.querySelector('.header');
const siteMainElement = pageBody.querySelector('.main');
const siteFooterStatistics = pageBody.querySelector('.footer__statistics');

render(siteHeaderElement, createRankTemplate());
render(siteMainElement, createFilterTemplate(filters));
render(siteMainElement, createSortingTemplate());
render(siteMainElement, createFilmsBoardTemplate());
render(siteFooterStatistics, createAllFilmsCountTemplate());

// ======= popup =======
// const taskFilmDetails = generateTask();
// render(pageBody, createFilmDetailsTemplate(taskFilmDetails));

const filmsBoard = siteMainElement.querySelector('.films');
const filmsListMain = filmsBoard.querySelector('.films-list--main');
const filmsListExtra = filmsBoard.querySelector('.films-list__container--extra');
const filmsListTop = filmsBoard.querySelector('.films-list__container--top');
const filmsListMainContainer = filmsListMain.querySelector('.films-list__container');

// render cards
for (let i = 0; i < Math.min(SHOW_CARD, tasks.length); i++) {
  render(filmsListMainContainer, createFilmCardTemplate(tasks[i]));
}

// render extra
tasksExtraGenerateArr.forEach((task) => {
  render(filmsListExtra, createFilmCardTemplate(task));
  render(filmsListTop, createFilmCardTemplate(task));
});

// show more cards
if (tasks.length > SHOW_CARD) {
  render(filmsListMain, createShowMoreTemplate());

  let currentPos = 0;

  const showMoreCards = () => {
    tasks
      .slice(currentPos, SHOW_CARD + currentPos)
      .forEach((task) => render(filmsListMainContainer, createFilmCardTemplate(task)));

    currentPos += SHOW_CARD;
  };

  const btnShowMore = filmsListMain.querySelector('.films-list__show-more');
  btnShowMore.addEventListener('click', showMoreCards);
}

