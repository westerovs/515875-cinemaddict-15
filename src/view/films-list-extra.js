import Abstract from '../utils/abstract/abstract.js';

const createFilmsListExtraTemplate = (title, type) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${ title }</h2>
    <div class="films-list__container" data-extra-type="${ type }"></div>
  </section>`
);

export default class FilmsListExtra extends Abstract {
  constructor(title, type) {
    super();
    this._title = title;
    this._type = type;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._title, this._type);
  }
}
