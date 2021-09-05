/*
* Обработчики должны добавляться во вьюхе, иначе это нарушение паттерна
* Пользователь чего-то жмакает по попапу
* это приводит к перерисовке формы
* раз форма удаляется, то удаляются и обработчики
* Тут же навешиваем обработчики через restoreHandlers
* */

import { isDay } from '../utils/days.js';
import { EMOTION } from '../utils/const.js';
import Abstract from './abstract.js';
/* eslint-disable */

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
      </label>
    `
  })

  return template
}

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

  const emoji = emotion ? `<img src="./images/emoji/${ emotion }.png" width="55" height="55" alt="${ emotion }">` : '';

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
                ${ emoji }
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

export default class FilmDetails extends Abstract {
  constructor(film) {
    super();
    // хранит состояние попапа / парсим информацию в состояние
    this._state = FilmDetails.parseFilmToData(film);

    this._emotionClickHandler = this._emotionClickHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);

    this._toCloseClickHandler = this._toCloseClickHandler.bind(this);

    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._state);
  }

  _toCloseClickHandler() {
    this._callback.toCloseClick();
  }

  setToCloseClickHandler(callback) {
    this._callback.toCloseClick = callback;
    const closeBtn = this.getElement().querySelector('.film-details__close-btn');

    closeBtn.addEventListener('click', this._toCloseClickHandler);
  }

  // ↓ controls ↓
  _watchListClickHandler() {
    this._callback.watchListClick(this._state);
  }

  _watchedClickHandler() {
    this._callback.watchedClick(this._state);
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick(this._state);
  }

  // ↓ controls ↓
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

  // ================================== new

  // ↓ emotion ↓
  _emotionClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.closest('.film-details__emoji-item')) return;

    console.log(evt.target)
    // т.к чекбоксы сами себя перерисовывают, нам надо подумать, как эту инфу сохранить в состояние
    this.updateState({
      emotion : evt.target.value,
    });

    this.getElement().querySelectorAll('.film-details__emoji-item')
      .forEach((emotion) => {
        if(emotion.value === evt.target.value){
          emotion.setAttribute('checked', 'true');
        }
      });
  }

  // ↓ comment ↓
  // если происходит ввод в текст ареа, то нам не нужно думать о перерисовке. Браузер сам думает
  _commentInputHandler(evt) {
    evt.preventDefault();

    this.updateState({
      commentText : evt.target.value,
    },true);
  }

  _setInnerHandlers() {
    const emojiList = this.getElement().querySelector('.film-details__emoji-list');
    emojiList.addEventListener('click', this._emotionClickHandler);

    // console.log(emojiList)
    // this.getElement().querySelectorAll('.film-details__emoji-item')
    //   .forEach((emotion) => emotion.addEventListener('click', this._emotionClickHandler));

    // textarea
    this.getElement().querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);
  }

  // restoreHandlers, который будет восстанавливать обработчики после обновления.
  // Здесь нужно восстановить как внутренние, так и внешние
  restoreHandlers() {
    //  восстановить обработчики
    this._setInnerHandlers();

    this.setToCloseClickHandler(this._callback.toCloseClick);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  }

  // [1] update состояния
  // вызывать когда пользователь взаимодействует с попапом
  // justDataUpdate обновить состояние без перерисовки
  updateState(update, justDataUpdate) {
    // если ничего не обновилось, то и нехуй перерисовки вызывать
    if (!update) {
      return;
    }

    this._state = Object.assign({}, this._state, update);

    if (justDataUpdate) {
      return;
    }

    this.updateElement();
  }

  //  [2] // Объявим метод updateElement, его задача удалить старый DOM элемент, вызвать генерацию нового и заменить один на другой
  updateElement() {
    // получить предыдущий элемент
    // удалить предыдущий элемент
    // как только вызвали update - текущий становится предыдущим
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    // Вызовем метод restoreHandlers после обновления в updateElement
    this.restoreHandlers();
  }

  static parseFilmToData(film) {
    // static потому что не используют контекст
    // - film это то что сейчас в модели(информация). Объект описывающий задачу
    //    В этом объекте есть только те ключи, которые относятся к задачи
    /*
    * Эмоция либо отображается, либо нет
    * КомментText либо отображается, либо нет
    * */
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

  // - под data, мы понимаем данные которые есть в самом компоненте
  //  Некое состояние. Снимок информации на данный момент(состояние)
  // здесь состояние превращается в информацию. Эту инфу можно отдать презентору
  // Презентер может передать модели. Модель может сохранить
  static parseDataToFilm(data) {
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

  reset(film){
    this.updateState(
      FilmDetails.parseFilmToData(film),
    );
  }
}
