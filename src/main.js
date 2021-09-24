import { render } from './utils/render.js';
import { UpdateType } from './utils/const.js';

import Api from './api.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import MoviesPresenter from './presenter/movies-presenter.js';
import MainMenuPresenter from './presenter/main-menu-presenter.js';
import FooterStatisticView from './view/footer/footer-statistic.js';

const AUTHORIZATION = 'Basic 555WTFuckThePower666JavaScript2077';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const api = new Api(END_POINT, AUTHORIZATION);

const pageBodyElement = document.querySelector('body');
const siteHeaderElement = pageBodyElement.querySelector('.header');
const siteMainElement = pageBodyElement.querySelector('.main');
const siteFooterStatisticsElement = pageBodyElement.querySelector('.footer__statistics');

const filterModel = new FilterModel();
const moviesModel = new MoviesModel();

const moviesPresenter = new MoviesPresenter(siteMainElement, moviesModel, filterModel, api);
const mainMenuPresenter = new MainMenuPresenter(
  siteMainElement,
  siteHeaderElement,
  filterModel,
  moviesModel,
  moviesPresenter,
);

moviesPresenter.init();

api.getMovies()
  .then((movies) => {
    mainMenuPresenter.init();

    moviesModel.setFilms(UpdateType.INIT, movies); // добавляет в модель фильмы
    render(siteFooterStatisticsElement, new FooterStatisticView(movies.length));
  })
  .catch((error) => {
    moviesModel.setFilms(UpdateType.INIT, []);
    throw new Error(error);
  });

