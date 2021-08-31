import { generateFilm } from './mock/film.js';
import { toFiltersCount } from './mock/filter.js';
import { render } from './utils/render.js';
import { Films } from './utils/const.js';

import MoviesPresenter from './presenter/movies.js';
import RankView from './view/rank.js';
import FilterView from './view/filter.js';
import FooterStatisticView from './view/footer-statistic.js';

const films = new Array(Films.FILM_COUNT).fill('').map(() => generateFilm());

const ExtraTypeFilms = {
  topRated: films
    .slice()
    .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
    .slice(0, Films.SHOW_FILMS_EXTRA),
  mostCommented: films
    .slice()
    .sort((a, b) => b.comments.size - a.comments.size)
    .slice(0, Films.SHOW_FILMS_EXTRA),
};

const filmsExtra = {
  topRated: ExtraTypeFilms.topRated,
  mostCommented: ExtraTypeFilms.mostCommented,
};

const filters = toFiltersCount(films);

const pageBody = document.querySelector('body');
const siteHeaderElement = pageBody.querySelector('.header');
const siteMainElement = pageBody.querySelector('.main');
const siteFooterStatistics = pageBody.querySelector('.footer__statistics');

render(siteHeaderElement, new RankView());
render(siteMainElement, new FilterView(filters));
render(siteFooterStatistics, new FooterStatisticView(Films.TOTAL_MOVIES));

const moviesPresenter = new MoviesPresenter(siteMainElement);
moviesPresenter.init(films, filmsExtra);
