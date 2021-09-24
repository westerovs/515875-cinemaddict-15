import AbstractView from '../../utils/abstract/abstract-view.js';

const createFooterStatisticTemplate = (allFilmsCount) => (
  `<section class="footer__statistics">
    <p>${ allFilmsCount } movies inside</p>
  </section>`
);

class FooterStatistic extends AbstractView {
  constructor(countFilms) {
    super();
    this._countFilms = countFilms;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._countFilms);
  }
}

export default FooterStatistic;
