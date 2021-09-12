import AbstractView from '../utils/abstract/abstract-view.js';

const createFilmListTemplate = () => (
  `<section class="films-list films-list--main">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>
    </section>`
);

export default class FilmsList extends AbstractView {
  getTemplate() {
    return createFilmListTemplate();
  }
}
