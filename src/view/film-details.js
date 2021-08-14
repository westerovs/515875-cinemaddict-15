import { isDay } from '../utils/days.js';

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

export const createFilmDetailsTemplate = (task) => {
  const { id, comments, filmInfo, userDetails } = task;
  const { watchlist, alreadyWatched, favorite } = userDetails;
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

  return `
    <section class="film-details" id="${ id }">
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
                ${ watchlist ? 'film-details__control-button--active' : '' }"
              id="watchlist" name="watchlist">
              Add to watchlist
            </button>
            <button type="button"
              class="film-details__control-button film-details__control-button--watched
                ${ alreadyWatched ? 'film-details__control-button--active' : '' }"
              id="watched" name="watched">
              Already watched
            </button>
            <button type="button"
              class="film-details__control-button film-details__control-button--favorite
                ${ favorite ? 'film-details__control-button--active' : '' }"
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
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`;
};

