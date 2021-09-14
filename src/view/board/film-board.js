import AbstractView from '../../utils/abstract/abstract-view.js';

const createFilmsBoardTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmBoard extends AbstractView {
  getTemplate() {
    return createFilmsBoardTemplate();
  }
}

