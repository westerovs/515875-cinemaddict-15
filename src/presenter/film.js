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

    this._handleWatchListClick = this._handleWatchListClick.bind(this)
    this._handleWatchedClick = this._handleWatchedClick.bind(this)
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this)
  }

  // *** details ***
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

  _onEscKeyDown(evt) {
    if (evt.code === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeFilmDetails();
    }
  }

  // *** controls ***
  _handleWatchListClick() {
    console.log('WatchListClick')
  }

  _handleWatchedClick() {
    console.log('WatchedClick')
  }

  _handleFavoriteClick() {
    console.log('FavoriteClick')
  }

  _renderFilm(filmListElement) {
    this.filmComponent.setFilmDetailsClickHandler(this._showFilmDetails);

    this.filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this.filmComponent.setWatchListClickHandler(this._handleWatchListClick);
    this.filmComponent.setWatchedClickHandler(this._handleWatchedClick);

    render(filmListElement, this.filmComponent);
  }

  init(filmListElement, film) {
    this.filmComponent = new FilmCardView(film);
    this.filmDetailsComponent = new FilmDetailsView(film);

    this._renderFilm(filmListElement, film);
  }
}
