import { generateFilm } from './utils/mock/film.js';
import { render } from './utils/render.js';
import { Films } from './utils/const.js';

// Model
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter.js';
// View
import FooterStatisticView from './view/footer-statistic.js';
// Presenter
import MoviesPresenter from './presenter/movies-presenter.js';
import MainMenuPresenter from './presenter/main-menu-presenter.js';

const films = new Array(Films.FILMS_COUNT).fill('').map(() => generateFilm());

const filterModel = new FilterModel();
const moviesModel = new MoviesModel();
moviesModel.setFilms(films);

const pageBody = document.querySelector('body');
const siteHeaderElement = pageBody.querySelector('.header');
const siteMainElement = pageBody.querySelector('.main');
const siteFooterStatistics = pageBody.querySelector('.footer__statistics');

render(siteFooterStatistics, new FooterStatisticView(Films.TOTAL_MOVIES));


// ГЛАВНОЕ МЕНЮ !
const mainMenu = new MainMenuPresenter(siteMainElement, siteHeaderElement, filterModel, moviesModel);
mainMenu.init();

// ДОСКА ФИЛЬМОВ !
const moviesPresenter = new MoviesPresenter(siteMainElement, moviesModel);
moviesPresenter.init();
