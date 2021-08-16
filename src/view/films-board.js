import { createElement } from '../utils/utils.js';

const createFilmsBoardTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmBoard {
  constructor() {
    this._elem = null;
  }

  getTemplate() {
    return createFilmsBoardTemplate();
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

