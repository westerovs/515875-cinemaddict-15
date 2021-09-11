/*
* дополнительный презентер, отвечает за обработку карточки фильма
* */
/* eslint-disable */
import { removeComponent, render, replace } from '../utils/render.js';
import { UserAction, UpdateType } from '../utils/const.js';
import AbstractObserver from '../utils/abstract/abstract-observer.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';

const observer = new AbstractObserver();

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Film {
  constructor(filmContainer, _handleModalChange) {
    this._filmContainer = filmContainer;
    this._handleModalChange = _handleModalChange;

    this._film = null;
    this._mode = Mode.DEFAULT;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._renderFilmDetails = this._renderFilmDetails.bind(this);
    this._destroyFilmDetails = this._destroyFilmDetails.bind(this);
    this._onEscCloseFilmDetails = this._onEscCloseFilmDetails.bind(this);
    // *** ↓ handle controls ↓ ***
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);

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

    // todo порефакторить
    if (this._mode === Mode.DEFAULT) {
      replace(this._filmCardComponent, prevFilmComponent);
      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._filmCardComponent, prevFilmComponent);
      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
      this._mode = Mode.DEFAULT;
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

    this._filmDetailsComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._filmDetailsComponent.setFormSubmitHandler(this._handleFormSubmit);
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

    this._handleModalChange(
      UserAction.UPDATE_FILM_CARD,
      UpdateType.MINOR,
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

    this._handleModalChange(
      UserAction.UPDATE_FILM_CARD,
      UpdateType.MINOR,
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

    this._handleModalChange(
      UserAction.UPDATE_FILM_CARD,
      UpdateType.MINOR,
      updatedFilm
    );
  }

  _destroy() {
    removeComponent(this._filmCardComponent);
    removeComponent(this._filmDetailsComponent);
  }

  resetView() {
    console.log('resetView')
    // if (this._mode !== Mode.DEFAULT) {
    //   this._replaceFormToCard();
    // }
  }

  setViewState(state) {
    console.log('setViewState')
    // if (this._mode === Mode.DEFAULT) {
    //   return;
    // }
    //
    // const resetFormState = () => {
    //   this._taskEditComponent.updateData({
    //     isDisabled: false,
    //     isSaving: false,
    //     isDeleting: false,
    //   });
    // };
    //
    // switch (state) {
    //   case State.SAVING:
    //     this._taskEditComponent.updateData({
    //       isDisabled: true,
    //       isSaving: true,
    //     });
    //     break;
    //   case State.DELETING:
    //     this._taskEditComponent.updateData({
    //       isDisabled: true,
    //       isDeleting: true,
    //     });
    //     break;
    //   case State.ABORTING:
    //     this._taskComponent.shake(resetFormState);
    //     this._taskEditComponent.shake(resetFormState);
    //     break;
    // }
  }

  _handleFormSubmit(update) {
    console.log('_handleFormSubmit')
    // Проверяем, поменялись ли в задаче данные, которые попадают под фильтрацию,
    // а значит требуют перерисовки списка - если таких нет, это PATCH-обновление

    // const isMinorUpdate =
    //   !isDatesEqual(this._task.dueDate, update.dueDate) ||
    //   isTaskRepeating(this._task.repeating) !== isTaskRepeating(update.repeating);
    //
    // this._changeData(
    //   UserAction.UPDATE_TASK,
    //   isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
    //   update,
    // );
    // this._replaceFormToCard();
  }

  _handleDeleteClick(film) {
    console.log('_handleDeleteClick')
    // this._handleModalChange(
    //   UserAction.DELETE_COMMENT,
    //   UpdateType.MINOR,
    //   film,
    // );
  }
}
