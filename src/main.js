import { generateFilm } from './mock/film.js';
import { toFiltersCount } from './mock/filter.js';
import { render } from './utils/render.js';

import MoviesPresenter from './presenter/movies.js';
import RankView from './view/rank.js';
import FilterView from './view/filter.js';
import FooterStatistic from './view/footer-statistic.js';

const FILM_COUNT = 7;
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

const moviesPresenter = new MoviesPresenter(siteMainElement);

moviesPresenter.init(films, filmsExtra);
