/*
* дополнительный презентер, отвечает за обработку карточки фильма
* */
/* eslint-disable */
import { removeComponent, render, replace } from '../utils/render.js';
import { UserAction, UpdateType, KeyCodes } from '../utils/const.js';
import { FilterType } from '../utils/filter.js';
import AbstractObserver from '../utils/abstract/abstract-observer.js';
import FilmCardView from '../view/film-cards/film-card.js';
import FilmDetailsView from '../view/film-cards/film-details.js';

const observer = new AbstractObserver();

export default class FilmPresenter {
  constructor(filmContainer, _handleViewAction, currentFilterType) {
    this._filmContainer = filmContainer;
    this._handleViewAction = _handleViewAction;
    this._currentFilterType = currentFilterType;

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
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;
    // сперва создаются вюьхи, потом пересоздаются
    this._filmCardComponent    = new FilmCardView(film);
    this._filmDetailsComponent = new FilmDetailsView(film);

    this._addHandlers();
    observer.addObserver(this._destroyFilmDetails);

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
    observer._notify(this._destroyFilmDetails);

    render(document.body, this._filmDetailsComponent.getElement());

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscCloseFilmDetails );

    this._filmDetailsComponent.setCloseDetailsClickHandler(this._destroyFilmDetails);
    this._filmDetailsComponent.reset();
  }

  _addHandlers() {
    this._filmCardComponent.setShowFilmDetailsClickHandler(this._renderFilmDetails);

    // // *** ↓ set handle film controls ↓ ***
    this._filmCardComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    // *** ↓ set handle pop-up controls ↓ ***
    this._filmDetailsComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmDetailsComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsComponent.setOnDeleteCommentClick(this._handleDeleteCommentClick);

  }

  _destroyFilmDetails() {
    this._filmDetailsComponent.getElement().remove();
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscCloseFilmDetails);
  }

  _onEscCloseFilmDetails(evt) {
    if (evt.code === KeyCodes.ESCAPE || evt.key === 'Esc') {
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

    this._handleViewAction(
      UserAction.UPDATE_FILM_CARD,
      this._currentFilterType === FilterType.WATCHLIST ? UpdateType.MINOR : UpdateType.PATCH,
      updatedFilm
    );
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

    this._handleViewAction(
      UserAction.UPDATE_FILM_CARD,
      this._currentFilterType === FilterType.HISTORY ? UpdateType.MINOR : UpdateType.PATCH,
      updatedFilm
    );
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

    this._handleViewAction(
      UserAction.UPDATE_FILM_CARD,
      this._currentFilterType === FilterType.FAVORITES ? UpdateType.MINOR : UpdateType.PATCH,
      updatedFilm
    );
  }

  // *** ↓ comments ↓ ***
  _handleDeleteCommentClick(card){
    this._handleViewAction(
      UserAction.UPDATE_FILM_CARD,
      UpdateType.PATCH,
      card,
    );
  }

  _handleSubmitNewComment(card){
    this._handleViewAction(
      UserAction.UPDATE_FILM_CARD,
      UpdateType.PATCH,
      card,
    );
  }

  destroy() {
    removeComponent(this._filmCardComponent);
    removeComponent(this._filmDetailsComponent);
  }
}
