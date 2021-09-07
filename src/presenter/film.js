/*
* дополнительный презентер, отвечает за обработку карточки фильма
* */
import { removeComponent, render, replace } from '../utils/render.js';
import AbstractObserver from '../utils/abstract/abstract-observer.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';

const observer = new AbstractObserver();

export default class Film {
  constructor(filmContainer, handlerFilmsUpdate) {
    this._filmContainer = filmContainer;
    this._handlerFilmsUpdate = handlerFilmsUpdate;

    this._film = null;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._renderFilmDetails = this._renderFilmDetails.bind(this);
    this._destroyFilmDetails = this._destroyFilmDetails.bind(this);
    this._onEscCloseFilmDetails = this._onEscCloseFilmDetails.bind(this);
    // *** ↓ handle controls ↓ ***
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;
    // сперва создаются вюьхи, потом пересоздаются
    this._filmCardComponent    = new FilmCardView(film);
    this._filmDetailsComponent = new FilmDetailsView(film);

    this._addHandlers();
    observer.add(this._destroyFilmDetails);

    // [1] если первый init
    if (prevFilmComponent === null || prevFilmDetailsComponent === null) {
      this._renderFilm(this._filmContainer, film);
      return;
    }

    // [2] если init был, то нужно не рендерить, а заменить...
    if (this._filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmComponent);
    }
    if (document.contains(prevFilmDetailsComponent.getElement())) {
      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
      this._filmDetailsComponent.setCloseDetailsClickHandler(this._destroyFilmDetails);
    }

    removeComponent(prevFilmComponent);
    removeComponent(prevFilmDetailsComponent);
  }

  // главный метод для начала работы модуля
  _renderFilm() {
    render(this._filmContainer, this._filmCardComponent);
  }

  _renderFilmDetails() {
    observer.notify(this._destroyFilmDetails);

    render(document.body, this._filmDetailsComponent.getElement());

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscCloseFilmDetails );

    this._filmDetailsComponent.setCloseDetailsClickHandler(this._destroyFilmDetails);
    this._filmDetailsComponent.reset();
  }

  _addHandlers() {
    this._filmCardComponent.setShowFilmDetailsClickHandler(this._renderFilmDetails);

    // *** ↓ set handle details controls ↓ ***
    this._filmDetailsComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmDetailsComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    // // *** ↓ set handle controls ↓ ***
    this._filmCardComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _destroyFilmDetails() {
    this._filmDetailsComponent.getElement().remove();
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscCloseFilmDetails);
  }

  // todo create Enam
  _onEscCloseFilmDetails(evt) {
    if (evt.code === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._destroyFilmDetails();
    }
  }

  // *** ↓ handle controls ↓ ***
  _handleWatchListClick() {
    // передаём объект задачи с изменённым свойством
    const userDetails = {
      isWatchlist: !this._film.userDetails.isWatchlist,
      isAlreadyWatched: this._film.userDetails.isAlreadyWatched,
      isWatchingDate: this._film.userDetails.isWatchingDate,
      isFavorite: this._film.userDetails.isFavorite,
    };

    const updatedFilm = Object.assign({}, this._film, { userDetails });

    this._handlerFilmsUpdate(updatedFilm);
  }

  _handleWatchedClick() {
    // передаём объект задачи с изменённым свойством
    const userDetails = {
      isWatchlist: this._film.userDetails.isWatchlist,
      isAlreadyWatched: !this._film.userDetails.isAlreadyWatched,
      isWatchingDate: this._film.userDetails.isWatchingDate,
      isFavorite: this._film.userDetails.isFavorite,
    };

    const updatedFilm = Object.assign({}, this._film, { userDetails });

    this._handlerFilmsUpdate(updatedFilm);
  }

  _handleFavoriteClick() {
    // передаём объект задачи с изменённым свойством
    const userDetails = {
      isWatchlist: this._film.userDetails.isWatchlist,
      isAlreadyWatched: this._film.userDetails.isAlreadyWatched,
      isWatchingDate: this._film.userDetails.isWatchingDate,
      isFavorite: !this._film.userDetails.isFavorite,
    };

    const updatedFilm = Object.assign({}, this._film, { userDetails });

    this._handlerFilmsUpdate(updatedFilm);
  }

  _destroy() {
    removeComponent(this._filmCardComponent);
    removeComponent(this._filmDetailsComponent);
  }
}
