import AbstractView from '../utils/abstract/abstract-view.js';

export const createShowMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ShowMoreBtn extends AbstractView {
  constructor() {
    super();
    this._onClickHandler = this._onClickHandler.bind(this);
  }

  getTemplate() {
    return createShowMoreTemplate();
  }

  _onClickHandler() {
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._onClickHandler);
  }
}
