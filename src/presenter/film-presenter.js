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
  constructor(filmContainer, handleViewAction, currentFilterType, api) {
    this._filmContainer = filmContainer;
    this._handleViewAction = handleViewAction;
    this._currentFilterType = currentFilterType;
    this._api = api;

    this._film = null;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._renderFilmDetails = this._renderFilmDetails.bind(this);
    this._destroyFilmDetails = this._destroyFilmDetails.bind(this);
    this._onEscCloseFilmDetails = this._onEscCloseFilmDetails.bind(this);
    // *** ↓ handle controls ↓ ***
    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._onSubmitEnterNewComment = this._onSubmitEnterNewComment.bind(this);
  }

  init(film) {
    this._film = film;
    const prevFilmComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    // сперва создаются вюьхи, потом пересоздаются
    this._filmCardComponent = new FilmCardView(film);

    this._addHandlers();
    observer.addObserver(this._destroyFilmDetails);

    // [1] если первый init
    if (prevFilmComponent === null) {
      this._renderFilm(this._filmContainer, film);
      return;
    }

    // [2] если init был, то нужно не рендерить, а заменить...
    if (this._filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmComponent);
    }
    if (prevFilmDetailsComponent && document.contains(prevFilmDetailsComponent.getElement())) {
      this._renderFilmDetails();
    }

    removeComponent(prevFilmComponent);
    removeComponent(prevFilmDetailsComponent);
  }

  _renderFilm() {
    render(this._filmContainer, this._filmCardComponent);
  }

  _renderFilmDetails() {
    observer._notify(this._destroyFilmDetails);

    this._api.getComments(this._film)
      .then((comments) => {
        this._film.comments = comments;
        this._filmDetailsComponent = new FilmDetailsView(this._film);
        this._addPopupHandlers();

        document.body.classList.add('hide-overflow');
        document.addEventListener('keydown', this._onEscCloseFilmDetails );
        render(document.body, this._filmDetailsComponent);

        this._filmDetailsComponent.setCloseDetailsClickHandler(this._destroyFilmDetails);
        this._filmDetailsComponent.reset();
      })
      .catch(() => {
        throw new Error('Не удалось загрузить информацию, попробуйте позже');
      });
  }

  _addHandlers() {
    this._filmCardComponent.setWatchListClickHandler(this._handleAddToWatchListClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmCardComponent.setShowFilmDetailsClickHandler(this._renderFilmDetails);
  }

  _addPopupHandlers() {
    this._filmDetailsComponent.setWatchListClickHandler(this._handleAddToWatchListClick);
    this._filmDetailsComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    // todo перенести сюда close btn ?
    this._filmDetailsComponent.setOnDeleteCommentClick(this._handleDeleteCommentClick);
    this._filmDetailsComponent.setSubmitNewComment(this._onSubmitEnterNewComment);
  }

  _destroyFilmDetails() {
    if (this._filmDetailsComponent) {
      this._filmDetailsComponent.getElement().remove();
    }
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
  _handleAddToWatchListClick() {
    const userDetails = Object.assign({}, this._film.userDetails,
      {
        isWatchlist: !this._film.userDetails.isWatchlist,
      },
    );

    const updatedFilm = Object.assign({}, this._film, { userDetails });

    this._handleViewAction(
      UserAction.UPDATE_FILM_CARD,
      (this._currentFilterType === FilterType.WATCHLIST) ? UpdateType.MINOR : UpdateType.PATCH,
      updatedFilm,
    );
  }

  _handleWatchedClick() {
    const userDetails = Object.assign({}, this._film.userDetails,
      {
        isAlreadyWatched: !this._film.userDetails.isAlreadyWatched,
        watchingDate: (this._film.userDetails.watchingDate === null) ? this._film.filmInfo.release.date : null,
      },
    );

    const updatedFilm = Object.assign({}, this._film, { userDetails });

    this._handleViewAction(
      UserAction.UPDATE_FILM_CARD,
      (this._currentFilterType === FilterType.HISTORY) ? UpdateType.MINOR : UpdateType.PATCH,
      updatedFilm,
    );
  }

  _handleFavoriteClick() {
    const userDetails = Object.assign({}, this._film.userDetails,
      {
        isFavorite: !this._film.userDetails.isFavorite,
      },
    );

    const updatedFilm = Object.assign({}, this._film, { userDetails });

    this._handleViewAction(
      UserAction.UPDATE_FILM_CARD,
      (this._currentFilterType === FilterType.FAVORITES) ? UpdateType.MINOR : UpdateType.PATCH,
      updatedFilm,
    );
  }

  // *** ↓ comments ↓ ***
  _handleDeleteCommentClick(film) {
    this._handleViewAction(UserAction.DELETE_COMMENT, UpdateType.PATCH, film);
  }

  _onSubmitEnterNewComment(film) {
    this._handleViewAction(
      UserAction.ADD_NEW_COMMENT,
      UpdateType.PATCH,
      film,
    );
  }

  // setAbortingSendNewComment() {
  //   this._filmDetailsComponent.shake(this._filmDetailsComponent.getElementOfNewComment(), this._resetFormState);
  // }
  //
  // setAbortingDeletingComment() {
  //   this._filmDetailsComponent.shake(this._filmDetailsComponent.getElementOfDeletingComment(), this._resetFormState);
  // }

  // _resetFormState() {
  //   this._filmDetailsComponent.updateState({
  //     isDisabledForm: false,
  //     isDisabledComment: false,
  //     isDeleting: false,
  //   });
  // }

  destroy() {
    removeComponent(this._filmCardComponent);
    removeComponent(this._filmDetailsComponent);
  }
}
