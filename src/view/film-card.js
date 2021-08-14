import { createElement } from '../utils/utils.js';

const createFilmCardTemplate = (film) => {
  const { id, comments, filmInfo, userDetails } = film;
  const { watchlist, alreadyWatched, favorite } = userDetails;
  const {
    title,
    totalRating,
    poster,
    release,
    runTime,
    genre,
    description,
  } = filmInfo;
  const { date } = release;
  const countComments = comments.size;

  const yearRelease = date.format('YYYY');

  return (
    `<article class="film-card" id="${ id }">
      <h3 class="film-card__title">${ title }</h3>
      <p class="film-card__rating">${ totalRating }</p>
      <p class="film-card__info">
        <span class="film-card__year">${ yearRelease }</span>
        <span class="film-card__duration">${ runTime }</span>
        <span class="film-card__genre">${ genre[0] }</span>
      </p>
      <img src="./images/posters/${ poster }" alt="" class="film-card__poster">
      <p class="film-card__description">${ description }</p>
      <a class="film-card__comments">${ countComments } comments</a>

      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist
          ${ watchlist ? 'film-card__controls-item--active' : ''}" type="button" title="Add to watchlist">
          Add to watchlist
        </button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched
          ${ alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button" title="Add to watched">
          Mark as watched
        </button>
        <button class="film-card__controls-item film-card__controls-item--favorite
          ${ favorite ? 'film-card__controls-item--active' : ''}" type="button" title="Add to favorite">
          Mark as favorite
        </button>
      </div>
    </article>`
  );
};

export default class FilmCard {
  constructor(film) {
    this._elem = null;
    this._task = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._task);
  }

  getElement() {
    if (!this._elem) {
      this._elem = createElement(this.getTemplate());
    }

    return this._elem;
  }

  remove() {
    this._elem = null;
  }
}

