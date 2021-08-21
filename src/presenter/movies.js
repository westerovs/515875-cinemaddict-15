/* eslint-disable */

import { generateFilm } from '../mock/film.js';
import { toFiltersCount } from '../mock/filter.js';
import { render } from '../utils/render.js';

import filmBoardView from '../view/film-board.js';

/*
*  Создайте класс для презентера списка фильмов и для презентера фильма (например, MovieList и Movie).
*
*  Конструктор презентера должен принимать необходимые данные.
*
*  Разнесите по презентерам всю логику по отрисовке фильмов и кнопки «Show more»,
*  а также по навешиванию на них обработчиков, из main.js.
*
*  В main.js создайте экземпляры презентеров, передайте данные и инициализируйте их.
* */

export default class Movies {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._boardComponent = filmBoardView;
  }

  _renderSort() {
    // Метод для рендеринга сортировки
  }

  _renderFilmEdit() {
    console.log('renderFilmEdit...');
  }

  _renderFilm() {
    // Метод для отрисовки одного фильма
  }

  _renderFilms() {
    // Метод для отрисовки группы фильмов за раз
    console.log('renderFilmsBoard...');
  }

  _renderFilmsBoard() {
    console.log('renderFilmsBoard...');
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
  }

  _renderNoFilms() {
    // Метод для рендеринга заглушки
  }

  _renderLoadMoreButton() {
    // Метод, куда уйдёт логика по отрисовке кнопки допоказа задач,
    // сейчас в main.js является частью renderBoard
  }

  init(films) {
    console.log('init')
    this._renderFilmEdit();
    this._renderFilm();
    this._renderFilmsBoard();
  }
}
