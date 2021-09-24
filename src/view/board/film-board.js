import AbstractView from '../../utils/abstract/abstract-view.js';

const createFilmsBoardTemplate = () => (
  '<section class="films"></section>'
);

class FilmBoard extends AbstractView {
  getTemplate() {
    return createFilmsBoardTemplate();
  }
}

export default FilmBoard;
