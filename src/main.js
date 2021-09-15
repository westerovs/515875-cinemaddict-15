import { generateFilm } from './utils/mock/film.js';
import { render } from './utils/render.js';
import { Films } from './utils/const.js';

// Model
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
// // View
import FooterStatisticView from './view/footer/footer-statistic.js';
// // Presenter
import MoviesPresenter from './presenter/movies-presenter.js';
import MainMenuPresenter from './presenter/main-menu-presenter.js';

const pageBody = document.querySelector('body');
const siteHeaderElement = pageBody.querySelector('.header');
const siteMainElement = pageBody.querySelector('.main');
const siteFooterStatistics = pageBody.querySelector('.footer__statistics');

render(siteFooterStatistics, new FooterStatisticView(Films.TOTAL_MOVIES));

const films = new Array(Films.FILMS_COUNT).fill('').map(() => generateFilm());

const filterModel = new FilterModel();
const moviesModel = new MoviesModel();
moviesModel.setFilms(films); // добавляет в модель фильмы

const moviesPresenter = new MoviesPresenter(siteMainElement, moviesModel, filterModel);
const mainMenuPresenter = new MainMenuPresenter(
  siteMainElement,
  siteHeaderElement,
  filterModel,
  moviesModel,
  moviesPresenter,
);
mainMenuPresenter.init();
moviesPresenter.init();
