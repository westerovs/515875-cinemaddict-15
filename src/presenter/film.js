import { render } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';

export default class Film {
  constructor() {

  }

  _renderFilmEdit(film) {
    const filmEditComponent = new FilmDetailsView(film);

    document.body.appendChild(filmEditComponent.getElement());
    document.body.classList.add('hide-overflow');

    const closeFilmDetails = () => {
      document.body.removeChild(filmEditComponent.getElement());
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    };

    function onEscKeyDown (evt) {
      if (evt.code === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closeFilmDetails();
      }
    }

    document.addEventListener('keydown', onEscKeyDown );

    filmEditComponent.setClickHandler(closeFilmDetails);
  }

  _renderFilm(filmListElement, film) {
    const filmComponent = new FilmCardView(film);
    filmComponent.setClickHandler(this._renderFilmEdit);

    render(filmListElement, filmComponent);
  }

  init(filmListElement, film) {
    // eslint-disable-next-line no-console
    console.log('render film');
    this._renderFilm(filmListElement, film);
  }
}
