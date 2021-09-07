import Abstract from '../utils/abstract/abstract.js';

const createFilmsBoardTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmBoard extends Abstract {
  getTemplate() {
    return createFilmsBoardTemplate();
  }
}

