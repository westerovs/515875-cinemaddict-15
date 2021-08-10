export const createFilmCardTemplate = (task) => {
  const {
    id,
    name,
    year,
    desc,
    poster,
    genre,
    duration,
    rating,
    comments,
    watchlist,
    watched,
    favorite,
  } = task;

  return `
    <article class="film-card">
      <h3 class="film-card__title">${ id } ${ name }</h3>
      <p class="film-card__rating">${ rating }</p>
      <p class="film-card__info">
        <span class="film-card__year">${ year }</span>
        <span class="film-card__duration">${ duration }</span>
        <span class="film-card__genre">${ genre }</span>
      </p>
      <img src="${ poster }" alt="" class="film-card__poster">
      <p class="film-card__description">${ desc }</p>
      <a class="film-card__comments">${ comments.size } comments</a>

      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist
          ${ watchlist ? 'film-card__controls-item--active' : ''}" type="button" title="Add to watchlist">
          Add to watchlist
        </button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched
          ${ watched ? 'film-card__controls-item--active' : ''}" type="button" title="Add to watched">
          Mark as watched
        </button>
        <button class="film-card__controls-item film-card__controls-item--favorite
          ${ favorite ? 'film-card__controls-item--active' : ''}" type="button" title="Add to favorite">
          Mark as favorite
        </button>
      </div>
    </article>`;
};
