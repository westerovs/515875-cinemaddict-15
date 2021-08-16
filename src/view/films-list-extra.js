import { createElement } from '../utils/utils.js';

const createFilmsListExtraTemplate = (title) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${ title }</h2>
    <div class="films-list__container"></div>
  </section>`
);

export default class FilmsListExtra {
  constructor(title) {
    this._elem = null;
    this._title = title;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._title);
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
