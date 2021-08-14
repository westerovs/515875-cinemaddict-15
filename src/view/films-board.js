import { createElement } from '../utils/utils.js';

const createFilmsBoardTemplate = () => (
  `<section class="films">
    <section class="films-list films-list--main">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container films-list__container--extra"></div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container films-list__container--top"></div>
    </section>
  </section>`
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

