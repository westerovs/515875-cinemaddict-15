export const createFilmCardTemplate = (task) => {
  const { id, comments, filmInfo, userDetails } = task;
  const { watchlist, alreadyWatched, favorite } = userDetails;
  const {
    title,
    totalRating,
    poster,
    release,
    runtime,
    genre,
    description,
  } = filmInfo;

  return `
    <article class="film-card" id="${ id }">
      <h3 class="film-card__title">${ title }</h3>
      <p class="film-card__rating">${ totalRating }</p>
      <p class="film-card__info">
        <span class="film-card__year">${ release.date }</span>
        <span class="film-card__duration">${ runtime }</span>
        <span class="film-card__genre">${ genre }</span>
      </p>
      <img src="${ poster }" alt="" class="film-card__poster">
      <p class="film-card__description">${ description }</p>
      <a class="film-card__comments">${ comments.size } comments</a>

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
    </article>`;
};
