/*
* главный класс Model
* */
import AbstractObserver from '../utils/abstract/abstract-observer.js';

export default class MoviesModel extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }
}
