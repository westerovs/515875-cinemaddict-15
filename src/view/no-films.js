import { createElement } from '../utils/utils.js';

const createNoFilmLsTemplate = () => (
  '<h2 class="films-list__title">There are no movies in our database</h2>'
);

export default class NoFilms {
  constructor() {
    this._elem = null;
  }

  getTemplate() {
    return createNoFilmLsTemplate();
  }

  getElement() {
    if (!this._elem) {
      this._elem = createElement(this.getTemplate());
    }

    return this._elem;
  }

  remove() {
    this._elem = null;
  }
}

