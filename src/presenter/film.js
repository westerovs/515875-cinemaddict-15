/* eslint-disable */
import { removeComponent, render, replace } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';

export default class Film {
  constructor(filmContainer, changeDataFilm) {
    this.filmContainer = filmContainer;
    this._changeDataFilm = changeDataFilm;

    this.film = null;
    this.filmComponent = null;
    this.filmDetailsComponent = null;

    this._showFilmDetails = this._showFilmDetails.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._onEscCloseFilmDetails = this._onEscCloseFilmDetails.bind(this);

    // *** ↓ handle details controls ↓ ***
    this._handleDetailsWatchListClick = this._handleDetailsWatchListClick.bind(this);
    this._handleDetailsWatchedClick = this._handleDetailsWatchedClick.bind(this);
    this._handleDetailsFavoriteClick = this._handleDetailsFavoriteClick.bind(this);

    // *** ↓ handle controls ↓ ***
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  // *** ↓ film details ↓ ***
  _showFilmDetails() {
    document.body.appendChild(this.filmDetailsComponent.getElement());
    document.body.classList.add('hide-overflow');

    document.addEventListener('keydown', this._onEscCloseFilmDetails );
    this.filmDetailsComponent.setToCloseClickHandler(this._closeFilmDetails);
  }

  _closeFilmDetails() {
    // document.body.removeChild(this.filmDetailsComponent);
    removeComponent(this.filmDetailsComponent)
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscCloseFilmDetails);
  }

  _onEscCloseFilmDetails(evt) {
    if (evt.code === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeFilmDetails();
    }
  }

  // *** ↓ handle details controls ↓ ***
  _handleDetailsWatchListClick() {
    console.log('click 1')
  }

  _handleDetailsWatchedClick() {
    console.log('click 2')
  }

  _handleDetailsFavoriteClick() {
    console.log('click 3')
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
  _renderFilm() {
    // this.filmComponent.setFilmDetailsClickHandler(this._showFilmDetails);

    render(this.filmContainer, this.filmComponent);
  }

  init(film) {
    this.film = film;

    const prevFilmComponent = this.filmComponent;
    const prevFilmDetailsComponent = this.filmDetailsComponent;

    // сперва создаются вюьхи, потом пересоздаются
    this.filmComponent = new FilmCardView(film);
    this.filmDetailsComponent = new FilmDetailsView(film);

    // set show popUp
    this.filmComponent.setFilmDetailsClickHandler(this._showFilmDetails);

    // *** ↓ set handle details controls ↓ ***
    this.filmDetailsComponent.setWatchListClickHandler(this._handleWatchListClick);
    this.filmDetailsComponent.setWatchedClickHandler(this._handleWatchedClick);
    this.filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    // *** ↓ set handle controls ↓ ***
    this.filmComponent.setWatchListClickHandler(this._handleWatchListClick);
    this.filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this.filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    // [1] если первый запуск, то...
    if (prevFilmComponent === null || prevFilmDetailsComponent === null) {
      this._renderFilm(this.filmContainer, film);
      return;
    }

    // [2] если init был, то нужно не отрисовать, а заменить...
    console.log('reInit');
    if (this.filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this.filmComponent, prevFilmComponent);
    }

    removeComponent(prevFilmComponent)
    removeComponent(prevFilmDetailsComponent)
  }
}
