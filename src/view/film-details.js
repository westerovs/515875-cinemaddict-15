/*
* Обработчики должны добавляться во вьюхе, иначе это нарушение паттерна
* Пользователь чего-то жмакает по попапу
* это приводит к перерисовке формы
* раз форма удаляется, то удаляются и обработчики
* Тут же навешиваем обработчики через restoreAllHandlers
* */

import { isDay } from '../utils/days.js';
import { EMOTION } from '../utils/const.js';
import Smart from './smart.js';

const createCommentTemplate = (comments) => {
  let template = '';

  comments.forEach((comment) => {
    const { id, emotion, comment: textComment, author, date } = comment;
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
            <button class="film-details__comment-delete">Delete</button>
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

  EMOTION.forEach((emoji) => {
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
  const { id, comments, filmInfo, userDetails, emotion, commentText } = state;
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
  const countComments = comments.size;
  const releaseDate = date.format('DD MMMM YYYY');

  const emojiPic = emotion ? `<img src="./images/emoji/${ emotion }.png" width="55" height="55" alt="${ emotion }">` : '';

  return (
    `<section class="film-details" id="${ id }">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${ poster }" alt="">
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
                  <td class="film-details__cell">${ runTime }</td>
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
              ${ createCommentTemplate(comments) }
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
                ${ emojiPic }
              </div>

              <label class="film-details__comment-label">
                <textarea
                  class="film-details__comment-input"
                  placeholder="Select reaction below and write comment here"
                  name="comment">${ commentText ? commentText : '' }</textarea>
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

export default class FilmDetails extends Smart {
  constructor(film) {
    super();
    this._state = FilmDetails.parseFilmToData(film);

    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._closeDetailsClickHandler = this._closeDetailsClickHandler.bind(this);
    this._emotionClickHandler = this._emotionClickHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this.setInnerHandlers();

    this._scrollPosition = 0;
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._state);
  }

  _closeDetailsClickHandler() {
    this._callback.toCloseClick();
  }

  _watchListClickHandler() {
    this._callback.watchListClick(this._state);
  }

  _watchedClickHandler() {
    this._callback.watchedClick(this._state);
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick(this._state);
  }

  _emotionClickHandler(evt) {
    evt.preventDefault();
    this._scrollPosition = this.getElement().scrollTop;

    this.updateState({ emotion: evt.target.value });

    this.getElement().scrollTop = this._scrollPosition;

    const emojiItems = this.getElement().querySelectorAll('.film-details__emoji-item');
    emojiItems.forEach((emotion) => {
      if(emotion.value === evt.target.value){
        emotion.setAttribute('checked', 'true');
      }
    });
  }

  _commentInputHandler(evt) {
    this.updateState({ commentText: evt.target.value }, true);
  }

  setCloseDetailsClickHandler(callback) {
    this._callback.toCloseClick = callback;
    const closeBtn = this.getElement().querySelector('.film-details__close-btn');

    closeBtn.addEventListener('click', this._closeDetailsClickHandler);
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

  setInnerHandlers() {
    const emoji = this.getElement().querySelectorAll('.film-details__emoji-item');
    const textarea = this.getElement().querySelector('.film-details__comment-input');

    emoji.forEach((emotion) => emotion.addEventListener('click', this._emotionClickHandler));
    textarea.addEventListener('input', this._commentInputHandler);
  }

  restoreAllHandlers() {
    this.setInnerHandlers();

    this.setCloseDetailsClickHandler(this._callback.toCloseClick);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  }

  reset(film) {
    this.updateState(
      FilmDetails.parseFilmToData(film),
    );
  }

  static parseFilmToData(film) {
    //  ф-ция задача которой взять информацию и сделать некий снимок её, превратив в состояние
    return Object.assign(
      {},
      film,
      {
        emotion: null,
        commentText: null,
      },
    );
  }

  static parseDataToFilm(data) {
    // todo пока не нашёл где это применить. Думаю позже понадобится, при сохранении коммента.

    /*
      под data, мы понимаем данные которые есть в самом компоненте
      Снимок информации на данный момент(состояние)
      здесь состояние превращается в информацию. Эту инфу можно отдать презентору
      Презентер может передать модели. Модель может сохранить...
    */
    data = Object.assign({}, data);

    if (!data.emotion) {
      data.emotion = null;
    }
    if (!data.commentText) {
      data.commentText = null;
    }

    delete data.emotion;
    delete data.commentText;

    return data;
  }

}
