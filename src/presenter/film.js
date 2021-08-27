import { render } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';

export default class Film {
  constructor(changeDataFilm) {
    this._changeDataFilm = changeDataFilm;

    this.film = null;
    this.filmComponent = null;
    this.filmDetailsComponent = null;

    this._showFilmDetails = this._showFilmDetails.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);

    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  // *** ↓ film details ↓ ***
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

  // *** ↓ handle controls ↓ ***
  _handleWatchListClick() {
    // передаём объект задачи с изменённым свойством
    const userDetails = {
      isWatchlist: !this.film.userDetails.isWatchlist,
      isAlreadyWatched: this.film.userDetails.isAlreadyWatched,
      isWatchingDate: this.film.userDetails.isWatchingDate,
      isFavorite: this.film.userDetails.isFavorite,
    };

    const updateFilm = Object.assign({}, this.film, { userDetails });

    this._changeDataFilm(updateFilm);
  }

  _handleWatchedClick() {
    // передаём объект задачи с изменённым свойством
    const userDetails = {
      isWatchlist: this.film.userDetails.isWatchlist,
      isAlreadyWatched: !this.film.userDetails.isAlreadyWatched,
      isWatchingDate: this.film.userDetails.isWatchingDate,
      isFavorite: this.film.userDetails.isFavorite,
    };

    const updateFilm = Object.assign({}, this.film, { userDetails });

    this._changeDataFilm(updateFilm);
  }

  _handleFavoriteClick() {
    // передаём объект задачи с изменённым свойством
    const userDetails = {
      isWatchlist: this.film.userDetails.isWatchlist,
      isAlreadyWatched: this.film.userDetails.isAlreadyWatched,
      isWatchingDate: this.film.userDetails.isWatchingDate,
      isFavorite: !this.film.userDetails.isFavorite,
    };

    const updateFilm = Object.assign({}, this.film, { userDetails });

    this._changeDataFilm(updateFilm);
  }

  // главный метод для начала работы модуля
  _renderFilm(filmListElement) {
    this.filmComponent.setFilmDetailsClickHandler(this._showFilmDetails);

    render(filmListElement, this.filmComponent);
  }

  init(filmListElement, film) {
    this.film = film;

    this.filmComponent = new FilmCardView(film);
    this.filmDetailsComponent = new FilmDetailsView(film);

    this.filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this.filmComponent.setWatchListClickHandler(this._handleWatchListClick);
    this.filmComponent.setWatchedClickHandler(this._handleWatchedClick);

    this._renderFilm(filmListElement, film);
  }
}
