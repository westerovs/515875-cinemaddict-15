import AbstractView from '../utils/abstract/abstract-view.js';

const createNoFilmLsTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title">There are no movies in our database</h2>
  </section>`
);

export default class NoFilms extends AbstractView {
  getTemplate() {
    return createNoFilmLsTemplate();
  }
}

