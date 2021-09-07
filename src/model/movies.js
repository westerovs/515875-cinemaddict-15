/*
* главный Model
* */
import Abstract from '../utils/abstract/abstract.js';

export default class Movies extends Abstract {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    return this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }
}
