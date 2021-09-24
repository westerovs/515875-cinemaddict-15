import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { isDay } from '../../utils/days.js';
import { calculateRuntime } from '../../utils/statistic.js';
import { createElement, replace } from '../../utils/render.js';
import he from 'he';
import { EMOTIONS, KeyCode } from '../../utils/const.js';
import SmartView from '../../utils/abstract/smart.js';

dayjs.extend(RelativeTime);

const createCommentTemplate = (comments, isDisabledComment, isDeleting, commentToDelete) => {
  let template = '';

  comments.forEach((comment) => {
    const { id, emotion, comment: textComment, author, date } = comment;

    const getStatusBtnDelete = () => {
      if (!commentToDelete) {
        return 'Delete';
      }
      if (commentToDelete.id === id && isDeleting) {
        return 'Deleting...';
      }
      else {return 'Delete';}
    };

    template += `
      <li class="film-details__comment" id="${ id }">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${ emotion }.png" width="55" height="55" alt="emoji-smile">
        </span>
        <div>
          <p class="film-details__comment-text">${ textComment }</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${ author }</span>
            <span class="film-details__comment-day">${ isDay(date) }</span>

            <button ${ isDisabledComment ? 'disabled' : '' } class="film-details__comment-delete">
              ${ getStatusBtnDelete() }
            </button>
          </p>
        </div>
      </li>`;
  });

  return template;
};

const createGenreTemplate = (genre) => {
  let template = '';
  const countGenre = genre.length;

  genre.forEach((item) => template += `<span class="film-details__genre">${ item }</span>`);

  return `
    <td class="film-details__term">${ countGenre > 1 ? 'Genres' : 'Genre' }</td>
    <td class="film-details__cell">
        ${ template }
    </td>`;
};

const createEmojiTemplate = () => {
  let template = '';

  EMOTIONS.forEach((emoji) => {
    template += `
       <input class="film-details__emoji-item visually-hidden"
          name="comment-emoji"
          type="radio"
          id="emoji-${ emoji }"
          value="${ emoji }">
       <label class="film-details__emoji-label" for="emoji-${ emoji }">
         <img src="./images/emoji/${ emoji }.png" width="30" height="30" alt="emoji ${ emoji }">
       </label>`;
  });

  return template;
};

const createFilmDetailsTemplate = (state) => {
  const { id, comments, filmInfo, userDetails, isDisabledForm, isDisabledComment, isDeleting, commentToDelete } = state;
  const { isWatchlist, isAlreadyWatched, isFavorite } = userDetails;
  const {
    title,
    alternativeTitle,
    totalRating,
    poster,
    ageRating,
    director,
    writers,
    actors,
    release,
    runTime,
    genre,
    description,
  } = filmInfo;

  const { date, releaseCountry } = release;
  const countComments = comments.length;

  const releaseDate = dayjs(date).format('DD MMMM YYYY');

  const durationFilm = calculateRuntime(runTime);

  return (
    `<section class="film-details" id="${ id }">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${ poster }" alt="">
              <p class="film-details__age">${ ageRating }+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${ title }</h3>
                  <p class="film-details__title-original">Original: ${ alternativeTitle }</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${ totalRating }</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${ director }</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${ writers }</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${ actors }</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${ releaseDate }</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${ durationFilm }</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${ releaseCountry }</td>
                </tr>
                <tr class="film-details__row">
                  ${ createGenreTemplate(genre) }
                </tr>
              </table>

              <p class="film-details__film-description">${ description }</p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button"
              class="film-details__control-button film-details__control-button--watchlist
                ${ isWatchlist ? 'film-details__control-button--active' : '' }"
              id="watchlist" name="watchlist">
              Add to watchlist
            </button>
            <button type="button"
              class="film-details__control-button film-details__control-button--watched
                ${ isAlreadyWatched ? 'film-details__control-button--active' : '' }"
              id="watched" name="watched">
              Already watched
            </button>
            <button type="button"
              class="film-details__control-button film-details__control-button--favorite
                ${ isFavorite ? 'film-details__control-button--active' : '' }"
              id="favorite" name="favorite">
              Add to favorites
            </button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments
              <span class="film-details__comments-count">${ countComments }</span>
            </h3>

            <ul class="film-details__comments-list">
              ${ createCommentTemplate(comments, isDisabledComment, isDeleting, commentToDelete) }
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
               <!-- рендер emoji через js -->
              </div>

              <label class="film-details__comment-label">
                <textarea
                  ${ isDisabledForm ? 'disabled' : '' }
                  class="film-details__comment-input"
                  placeholder="Select reaction below and write comment here"
                  name="comment">${ state.newComment.commentText ? state.newComment.commentText : '' }</textarea>
              </label>

              <div class="film-details__emoji-list">
                ${ createEmojiTemplate() }
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

class FilmDetails extends SmartView {
  constructor(film) {
    super();
    this._state = FilmDetails.parseFilmToData(film);

    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._closeDetailsClickHandler = this._closeDetailsClickHandler.bind(this);

    this._emotionClickHandler = this._emotionClickHandler.bind(this);
    this._commentTextAreaHandler = this._commentTextAreaHandler.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._onSubmitEnterNewComment = this._onSubmitEnterNewComment.bind(this);
    this._onSubmitEnterNewComment = this._onSubmitEnterNewComment.bind(this);

    this.setInnerHandlers();
    this._scrollPosition = 0;
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._state);
  }

  reset(film) {
    this.updateState(
      FilmDetails.parseFilmToData(film),
    );
  }

  restoreAllHandlers() {
    this.setInnerHandlers();

    this.setCloseDetailsClickHandler(this._callback.toCloseClick);

    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);

    this.setOnDeleteCommentClick(this._callback.onDeleteClick);
    this.setSubmitNewComment(this._callback.onSubmitNewComment);
  }

  setSubmitNewComment(callback) {
    this._callback.onSubmitNewComment = callback;
    this.getElement().querySelector('.film-details__comment-input')
      .addEventListener('keydown', this._onSubmitEnterNewComment);
  }

  setOnDeleteCommentClick(callback) {
    this._callback.onDeleteClick = callback;
    this.getElement().querySelectorAll('.film-details__comment-delete')
      .forEach((button) => button.addEventListener('click', this._handleDeleteCommentClick));
  }

  setCloseDetailsClickHandler(callback) {
    this._callback.toCloseClick = callback;
    const closeBtn = this.getElement().querySelector('.film-details__close-btn');

    closeBtn.addEventListener('click', this._closeDetailsClickHandler);
  }

  setInnerHandlers() {
    // тут вешаем обработчики на клик по эмоции и textarea
    const emoji = this.getElement().querySelectorAll('.film-details__emoji-item');
    const textarea = this.getElement().querySelector('.film-details__comment-input');

    emoji.forEach((emotion) => emotion.addEventListener('click', this._emotionClickHandler));
    textarea.addEventListener('input', this._commentTextAreaHandler);
  }

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;

    const watchlist = this.getElement().querySelector('.film-details__control-button--watchlist');
    watchlist.addEventListener('click', this._watchListClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;

    const watched = this.getElement().querySelector('.film-details__control-button--watched');
    watched.addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;

    const favorite = this.getElement().querySelector('.film-details__control-button--favorite');
    favorite.addEventListener('click', this._favoriteClickHandler);
  }

  _closeDetailsClickHandler() {
    this._callback.toCloseClick();
  }

  // -------------------------------- controls ↓
  _watchListClickHandler() {
    this._callback.watchListClick(this._state);
  }

  _watchedClickHandler(e) {
    e.preventDefault();
    this._callback.watchedClick(this._state);
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick(this._state);
  }

  // -------------------------------- comments ↓
  _emotionClickHandler(evt) {
    evt.preventDefault();
    this._scrollPosition = this.getElement().scrollTop;

    this.updateState({
      newComment: Object.assign(
        {},
        this._state.newComment,
        {
          emotion: evt.target.value,
        },
      ),
    }, true);

    this._changeEmotion(evt.target.value);

    this.getElement().scrollTop = this._scrollPosition;

    const emojiItems = this.getElement().querySelectorAll('.film-details__emoji-item');

    [...emojiItems].find((it) => it.value === evt.target.value).setAttribute('checked', 'true');
  }

  _changeEmotion(newEmotion){
    const createEmotionElement = (emotion) => createElement(`<div class="film-details__add-emoji-label">
      ${emotion ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">` : ''}
      </div>`);
    const oldEmotionElement = document.querySelector('.film-details__add-emoji-label');
    const newEmotionElement = createEmotionElement(newEmotion);

    replace(newEmotionElement, oldEmotionElement);
  }

  _commentTextAreaHandler(evt) {
    this.updateState({
      newComment: Object.assign(
        {},
        this._state.newComment,
        {
          commentText: evt.target.value,
        },
      ),
    }, true);
  }

  _onSubmitEnterNewComment(evt) {
    if (evt.key === KeyCode.ENTER && evt.ctrlKey) {
      this._state.newComment = this._createNewComment();
      this._callback.onSubmitNewComment(this._state);
    }
  }

  _createNewComment() {
    if (!this._state.newComment.commentText) {
      throw new Error('Нельзя отправить пустой комментарий !');
    }
    else if (!this._state.newComment.emotion) {
      throw new Error('Пожалуйста, выберите эмоцию !');
    }

    return {
      comment: he.encode(this._state.newComment.commentText),
      emotion: this._state.newComment.emotion,
    };
  }

  _handleDeleteCommentClick(evt) {
    evt.preventDefault();
    const scrollTopPosition = this.getElement().scrollTop;

    const targetId = evt.target.closest('.film-details__comment').id;

    // получает id текущего комментария
    this._state.commentToDelete = this._state.comments.filter((comment) => comment.id === targetId)[0];
    // передаю текущий фильм с измененным состоянием, без комментария ↓
    this._callback.onDeleteClick(FilmDetails.getDataWithoutDeleteComment(this._state));
    document.querySelector('.film-details').scrollTop = scrollTopPosition;
  }


  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        newComment: {
          emotion: null,
          commentText: null,
        },
        commentToDelete: null,
        isDisabledForm: false,
        isDeleting: false,
        isDisabledComment: false,
      },
    );
  }

  static getDataWithoutDeleteComment(state) {
    state = Object.assign(
      {},
      state,
      {
        comments: state.comments.filter((comment) => comment.id !== state.commentToDelete.id),
      },
    );

    if (!state.newComment) {
      state.newComment = null;
    }

    delete state.newComment;
    delete state.isDisabled;
    delete state.isDeleting;

    return state;
  }

}

export default FilmDetails;

