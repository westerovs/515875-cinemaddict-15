import { createElement } from '../utils/utils.js';

const createFooterStatisticTemplate = (allFilmsCount) => (
  `<section class="footer__statistics">
    <p>${ allFilmsCount } movies inside</p>
  </section>`
);

export default class FooterStatistic {
  constructor(countFilms) {
    this._elem = null;
    this.countFilms = countFilms;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this.countFilms);
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
