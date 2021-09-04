import { generateFilm } from './mock/film.js';
import { toFiltersCount } from './mock/filter.js';
import { render } from './utils/render.js';
import { Films } from './utils/const.js';

import MoviesPresenter from './presenter/movies.js';
import RankView from './view/rank.js';
import FilterView from './view/filter.js';
import FooterStatisticView from './view/footer-statistic.js';

const films = new Array(Films.FILMS_COUNT).fill('').map(() => generateFilm());
const filters = toFiltersCount(films);

const pageBody = document.querySelector('body');
const siteHeaderElement = pageBody.querySelector('.header');
const siteMainElement = pageBody.querySelector('.main');
const siteFooterStatistics = pageBody.querySelector('.footer__statistics');

render(siteHeaderElement, new RankView());
render(siteMainElement, new FilterView(filters));
render(siteFooterStatistics, new FooterStatisticView(Films.TOTAL_MOVIES));

const moviesPresenter = new MoviesPresenter(siteMainElement);
moviesPresenter.init(films);
