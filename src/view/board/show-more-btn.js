import AbstractView from '../../utils/abstract/abstract-view.js';

const createShowMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

class ShowMoreBtn extends AbstractView {
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

export {
  createShowMoreTemplate
};

export default ShowMoreBtn;
