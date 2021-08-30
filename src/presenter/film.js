/* eslint-disable */
import { removeComponent, render, replace } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  SHOW: 'SHOW',
};

export default class Film {
  constructor(filmContainer, handlerFilmsUpdate, handleModeChange) {
    this.filmContainer = filmContainer;
    this._handlerFilmsUpdate = handlerFilmsUpdate;
    this._handleModeChange = handleModeChange;

    this.film = null;
    this.filmCardComponent = null;
    this.filmDetailsComponent = null;
    this._mode = Mode.DEFAULT;

    this._showFilmDetails = this._showFilmDetails.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._onEscCloseFilmDetails = this._onEscCloseFilmDetails.bind(this);

    // *** ↓ handle controls ↓ ***
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this.film = film;

    // this.setMode = this.mode.DEFAULT;
    // console.log(this.setMode)

    const prevFilmComponent = this.filmCardComponent;
    const prevFilmDetailsComponent = this.filmDetailsComponent;

    // сперва создаются вюьхи, потом пересоздаются
    this.filmCardComponent    = new FilmCardView(film);
    this.filmDetailsComponent = new FilmDetailsView(film);

    this._addHandlers();

    // [1] -------------------- если первый init
    if (prevFilmComponent === null || prevFilmDetailsComponent === null) {
      this._renderFilm(this.filmContainer, film);
      return;
    }

    // [2] -------------------- если init был, то нужно не рендерить, а заменить...
    if (this.filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this.filmCardComponent, prevFilmComponent);
    }
    if (document.contains(prevFilmDetailsComponent.getElement())) {
      replace(this.filmDetailsComponent, prevFilmDetailsComponent);
      this.filmDetailsComponent.setToCloseClickHandler(this._closeFilmDetails);
    }

    if (this._mode === Mode.DEFAULT) {
      console.log('aga DEFAULT')
      // replace(this.filmCardComponent, prevFilmComponent);
    }

    if (this._mode === Mode.SHOW) {
      console.log('aga SHOW')
      // replace(this.filmDetailsComponent, prevFilmDetailsComponent);
    }

    removeComponent(prevFilmComponent);
    removeComponent(prevFilmDetailsComponent);
  }

  // главный метод для начала работы модуля
  _renderFilm() {
    render(this.filmContainer, this.filmCardComponent);
  }

  _addHandlers() {
    this.filmCardComponent.setShowFilmDetailsClickHandler(this._showFilmDetails);

    // *** ↓ set handle details controls ↓ ***
    this.filmDetailsComponent.setWatchListClickHandler(this._handleWatchListClick);
    this.filmDetailsComponent.setWatchedClickHandler(this._handleWatchedClick);
    this.filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    // // *** ↓ set handle controls ↓ ***
    this.filmCardComponent.setWatchListClickHandler(this._handleWatchListClick);
    this.filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this.filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  // *** ↓ film details ↓ ***
  _showFilmDetails() {
    document.body.appendChild(this.filmDetailsComponent.getElement());
    document.body.classList.add('hide-overflow');

    document.addEventListener('keydown', this._onEscCloseFilmDetails );
    this.filmDetailsComponent.setToCloseClickHandler(this._closeFilmDetails);

    this._handleModeChange() // если идёт попытка сменить...
    this._mode = Mode.SHOW;
  }

  _closeFilmDetails() {
    console.log('close')
    this.filmDetailsComponent.getElement().remove()
    // document.body.removeChild(this.filmDetailsComponent.getElement());
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscCloseFilmDetails);

    this._mode = Mode.DEFAULT;
  }

  _onEscCloseFilmDetails(evt) {
    if (evt.code === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeFilmDetails();
    }
  }

  resetView() {
    // сбрасывает view в режим по умолчанию
    if (this._mode !== Mode.DEFAULT) {
      this._closeFilmDetails()
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

    const updatedFilm = Object.assign({}, this.film, { userDetails });

    this._handlerFilmsUpdate(updatedFilm);
  }

  _handleWatchedClick() {
    // передаём объект задачи с изменённым свойством
    const userDetails = {
      isWatchlist: this.film.userDetails.isWatchlist,
      isAlreadyWatched: !this.film.userDetails.isAlreadyWatched,
      isWatchingDate: this.film.userDetails.isWatchingDate,
      isFavorite: this.film.userDetails.isFavorite,
    };

    const updatedFilm = Object.assign({}, this.film, { userDetails });

    this._handlerFilmsUpdate(updatedFilm);
  }

  _handleFavoriteClick() {
    // передаём объект задачи с изменённым свойством
    const userDetails = {
      isWatchlist: this.film.userDetails.isWatchlist,
      isAlreadyWatched: this.film.userDetails.isAlreadyWatched,
      isWatchingDate: this.film.userDetails.isWatchingDate,
      isFavorite: !this.film.userDetails.isFavorite,
    };

    const updatedFilm = Object.assign({}, this.film, { userDetails });

    this._handlerFilmsUpdate(updatedFilm);
  }
}
