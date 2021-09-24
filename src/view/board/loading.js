import AbstractView from '../../utils/abstract/abstract-view.js';

const createLoadingTemplate = () => (
  `<section class="films">
    <sectin class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>
  </section>`);

class Loading extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}

export default Loading;
