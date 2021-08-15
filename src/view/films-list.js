import { createElement } from '../utils/utils.js';

const createFilmListTemplate = () => (
  `<section class="films-list films-list--main">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>
    </section>`
);

export default class FilmsList {
  constructor() {
    this._elem = null;
  }

  getTemplate() {
    return createFilmListTemplate();
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

