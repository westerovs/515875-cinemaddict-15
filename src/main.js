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

const pageBody = document.querySelector('body');
const siteHeaderElement = pageBody.querySelector('.header');
const siteMainElement = pageBody.querySelector('.main');
const siteFooterStatistics = pageBody.querySelector('.footer__statistics');

// const allFilms = new Array(Films.FILMS_COUNT).fill('').map(() => generateFilm());
// const films = allFilms.map((filmCard) => {
//   if(filmCard.userDetails.isAlreadyWatched) {
//     filmCard.userDetails.watchingDate = filmCard.filmInfo.release.date;
//   }
//   return filmCard;
// });

const filterModel = new FilterModel();
const moviesModel = new MoviesModel();

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

api.getMovies()
  .then((movies) => {

    const films = movies.map((filmCard) => {
      if(filmCard.userDetails.isAlreadyWatched) {
        filmCard.userDetails.watchingDate = filmCard.filmInfo.release.date;
      }
      return filmCard;
    });

    moviesModel.setFilms(UpdateType.INIT, films); // добавляет в модель фильмы
    render(siteFooterStatistics, new FooterStatisticView(films.length));
  })
  .catch((error) => {
    moviesModel.setFilms(UpdateType.INIT, []);
    throw new Error(error); // временно
  });

