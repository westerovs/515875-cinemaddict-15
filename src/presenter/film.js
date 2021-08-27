/* eslint-disable */
import { render } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';

export default class Film {
  constructor() {
    this.filmComponent = null;
    this.filmDetailsComponent = null;

    this._showFilmDetails = this._showFilmDetails.bind(this)
    this._closeFilmDetails = this._closeFilmDetails.bind(this)
    this._onEscKeyDown = this._onEscKeyDown.bind(this)
  }

  _showFilmDetails() {
    document.body.appendChild(this.filmDetailsComponent.getElement());
    document.body.classList.add('hide-overflow');

    document.addEventListener('keydown', this._onEscKeyDown );
    this.filmDetailsComponent.setClickHandler(this._closeFilmDetails);
  }

  _closeFilmDetails() {
    document.body.removeChild(this.filmDetailsComponent.getElement());
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _onEscKeyDown (evt) {
    if (evt.code === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeFilmDetails();
    }
  }

  _renderFilm(filmListElement) {
    this.filmComponent.setClickHandler(this._showFilmDetails);

    render(filmListElement, this.filmComponent);
  }

  init(filmListElement, film) {
    this.filmComponent = new FilmCardView(film);
    this.filmDetailsComponent = new FilmDetailsView(film);

    this._renderFilm(filmListElement, film);
  }
}
