import Abstract from '../utils/abstract/abstract.js';

const createFilmCardTemplate = (film) => {
  const { id, comments, filmInfo, userDetails } = film;
  const { isWatchlist, isAlreadyWatched, isFavorite } = userDetails;
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
          ${ isWatchlist ? 'film-card__controls-item--active' : ''}" type="button" title="Add to watchlist">
          Add to watchlist
        </button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched
          ${ isAlreadyWatched ? 'film-card__controls-item--active' : ''}" type="button" title="Add to watched">
          Mark as watched
        </button>
        <button class="film-card__controls-item film-card__controls-item--favorite
          ${ isFavorite ? 'film-card__controls-item--active' : ''}" type="button" title="Add to favorite">
          Mark as favorite
        </button>
      </div>
    </article>`
  );
};

export default class FilmCard extends Abstract {
  constructor(film) {
    super();
    this._film = film;

    this._showFilmDetailsClickHandler = this._showFilmDetailsClickHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _showFilmDetailsClickHandler() {
    this._callback.clickDetails(this._film);
  }

  _watchListClickHandler() {
    this._callback.clickwatchList();
  }

  _watchedClickHandler() {
    this._callback.clickWatched();
  }

  _favoriteClickHandler() {
    this._callback.clickFavorite();
  }

  setShowFilmDetailsClickHandler(callback) {
    this._callback.clickDetails = callback;

    const poster = this.getElement().querySelector('.film-card__poster');
    const title = this.getElement().querySelector('.film-card__title');
    const comments = this.getElement().querySelector('.film-card__comments');

    poster.addEventListener('click', this._showFilmDetailsClickHandler);
    title.addEventListener('click', this._showFilmDetailsClickHandler);
    comments.addEventListener('click', this._showFilmDetailsClickHandler);
  }

  // *** ↓ handle controls ↓ ***
  setWatchListClickHandler(callback) {
    this._callback.clickwatchList = callback;

    const watchlist = this.getElement().querySelector('.film-card__controls-item--add-to-watchlist');
    watchlist.addEventListener('click', this._watchListClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.clickWatched = callback;

    const watched = this.getElement().querySelector('.film-card__controls-item--mark-as-watched');
    watched.addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.clickFavorite = callback;

    const favorite = this.getElement().querySelector('.film-card__controls-item--favorite');
    favorite.addEventListener('click', this._favoriteClickHandler);
  }
}

