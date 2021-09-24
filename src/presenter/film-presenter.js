/*
* дополнительный презентер, отвечает за обработку карточки фильма
* */
import { removeComponent, render, replace } from '../utils/render.js';
import { UserAction, UpdateType, KeyCode, State } from '../utils/const.js';
import { FilterType } from '../utils/filter.js';
import AbstractObserver from '../utils/abstract/abstract-observer.js';
import FilmCardView from '../view/film-cards/film-card.js';
import FilmDetailsView from '../view/film-cards/film-details.js';

const observer = new AbstractObserver();

class FilmPresenter {
  constructor(filmContainer, handleViewAction, currentFilterType, api) {
    this._filmContainer = filmContainer;
    this._viewActionHandler = handleViewAction;
    this._currentFilterType = currentFilterType;
    this._api = api;

    this._film = null;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._renderFilmDetails = this._renderFilmDetails.bind(this);
    this._destroyFilmDetails = this._destroyFilmDetails.bind(this);
    this._escCloseFilmDetailsHandler = this._escCloseFilmDetailsHandler.bind(this);
    // *** ↓ handle controls ↓ ***
    this._addToWatchListClickHandler = this._addToWatchListClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);
    this._onSubmitEnterNewCommentHandler = this._onSubmitEnterNewCommentHandler.bind(this);
  }

  init(film) {
    this._film = film;
    const prevFilmComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardView(film);

    this._addHandlers();
    observer.addObserver(this._destroyFilmDetails);

    if (prevFilmComponent === null) {
      this._renderFilm(this._filmContainer, film);
      return;
    }

    if (this._filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmComponent);
    }
    if (prevFilmDetailsComponent && document.contains(prevFilmDetailsComponent.getElement())) {
      this._renderFilmDetails();
    }

    removeComponent(prevFilmComponent);
    removeComponent(prevFilmDetailsComponent);
  }

  destroy() {
    removeComponent(this._filmCardComponent);
    removeComponent(this._filmDetailsComponent);
  }

  getFilmDetails() {
    return this._filmDetailsComponent;
  }

  runErrorAnimations(duration = 1000) {
    this._filmDetailsComponent.getElement().classList.add('shake');
    this._scrollPosition = this._filmDetailsComponent.getElement().scrollTop;

    setTimeout(() => {
      this._filmDetailsComponent.getElement().classList.remove('shake');

      this._resetFormState();
      this._filmDetailsComponent.getElement().scrollTop = this._scrollPosition;
    }, duration);
  }

  setViewState(state) {
    switch (state) {
      case State.SENDING_NEW_COMMENT: {
        this._filmDetailsComponent.updateState({
          isDisabledForm: true,
        });
        break;
      }
      case State.DELETING: {
        this._filmDetailsComponent.updateState({
          isDisabledComment: true,
          isDeleting: true,
        });
        break;
      }
    }
  }

  _resetFormState() {
    this._filmDetailsComponent.updateState({
      isDisabledForm: false,
      isDisabledComment: false,
      isDeleting: false,
    });
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
        document.addEventListener('keydown', this._escCloseFilmDetailsHandler );
        render(document.body, this._filmDetailsComponent);

        this._filmDetailsComponent.setCloseDetailsClickHandler(this._destroyFilmDetails);
        this._filmDetailsComponent.reset();
      })
      .catch(() => {
        throw new Error('Не удалось загрузить информацию, попробуйте позже');
      });
  }

  _destroyFilmDetails() {
    if (this._filmDetailsComponent) {
      this._filmDetailsComponent.getElement().remove();
    }
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escCloseFilmDetailsHandler);
  }

  _addHandlers() {
    this._filmCardComponent.setWatchListClickHandler(this._addToWatchListClickHandler);
    this._filmCardComponent.setWatchedClickHandler(this._watchedClickHandler);
    this._filmCardComponent.setFavoriteClickHandler(this._favoriteClickHandler);
    this._filmCardComponent.setShowFilmDetailsClickHandler(this._renderFilmDetails);
  }

  _addPopupHandlers() {
    this._filmDetailsComponent.setWatchListClickHandler(this._addToWatchListClickHandler);
    this._filmDetailsComponent.setWatchedClickHandler(this._watchedClickHandler);
    this._filmDetailsComponent.setFavoriteClickHandler(this._favoriteClickHandler);

    this._filmDetailsComponent.setOnDeleteCommentClick(this._deleteCommentClickHandler);
    this._filmDetailsComponent.setSubmitNewComment(this._onSubmitEnterNewCommentHandler);
  }

  _escCloseFilmDetailsHandler(evt) {
    if (evt.code === KeyCode.ESCAPE || evt.key === 'Esc') {
      evt.preventDefault();
      this._destroyFilmDetails();
    }
  }

  _addToWatchListClickHandler() {
    const userDetails = Object.assign({}, this._film.userDetails,
      {
        isWatchlist: !this._film.userDetails.isWatchlist,
      },
    );

    const updatedFilm = Object.assign({}, this._film, { userDetails });

    this._viewActionHandler(
      UserAction.UPDATE_FILM_CARD,
      (this._currentFilterType === FilterType.WATCHLIST) ? UpdateType.MINOR : UpdateType.PATCH,
      updatedFilm,
    );
  }

  _watchedClickHandler() {
    const userDetails = Object.assign({}, this._film.userDetails,
      {
        isAlreadyWatched: !this._film.userDetails.isAlreadyWatched,
        watchingDate: (this._film.userDetails.watchingDate === null) ? this._film.filmInfo.release.date : null,
      },
    );

    const updatedFilm = Object.assign({}, this._film, { userDetails });

    this._viewActionHandler(
      UserAction.UPDATE_FILM_CARD,
      (this._currentFilterType === FilterType.HISTORY) ? UpdateType.MINOR : UpdateType.PATCH,
      updatedFilm,
    );
  }

  _favoriteClickHandler() {
    const userDetails = Object.assign({}, this._film.userDetails,
      {
        isFavorite: !this._film.userDetails.isFavorite,
      },
    );

    const updatedFilm = Object.assign({}, this._film, { userDetails });

    this._viewActionHandler(
      UserAction.UPDATE_FILM_CARD,
      (this._currentFilterType === FilterType.FAVORITES) ? UpdateType.MINOR : UpdateType.PATCH,
      updatedFilm,
    );
  }

  _deleteCommentClickHandler(film) {
    this._viewActionHandler(UserAction.DELETE_COMMENT, UpdateType.PATCH, film);
  }

  _onSubmitEnterNewCommentHandler(film) {
    this._viewActionHandler(
      UserAction.ADD_NEW_COMMENT,
      UpdateType.PATCH,
      film,
    );
  }
}

export default FilmPresenter;
