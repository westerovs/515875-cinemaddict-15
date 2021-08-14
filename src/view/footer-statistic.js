import { createElement } from '../utils/utils.js';

const createFooterStatisticTemplate = (allFilmsCount) => (
  `<section class="footer__statistics">
    <p>${ allFilmsCount } movies inside</p>
  </section>`
);

export default class FooterStatistic {
  constructor() {
    this._elem = null;
  }

  getTemplate(count) {
    return createFooterStatisticTemplate(count);
  }

  getElement(count) {
    if (!this._elem) {
      this._elem = createElement(this.getTemplate(count));
    }

    return this._elem;
  }

  remove() {
    this._elem = null;
  }
}
