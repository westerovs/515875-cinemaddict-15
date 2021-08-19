import Abstract from './abstract.js';

const createFooterStatisticTemplate = (allFilmsCount) => (
  `<section class="footer__statistics">
    <p>${ allFilmsCount } movies inside</p>
  </section>`
);

export default class FooterStatistic extends Abstract {
  constructor(countFilms) {
    super();
    this._countFilms = countFilms;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._countFilms);
  }
}
