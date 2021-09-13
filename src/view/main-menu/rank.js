import AbstractView from '../../utils/abstract/abstract-view.js';

const createRankTemplate = (watchedMovies) => {
  const viewed = watchedMovies();

  let rank = null;

  if (viewed <= 0) { return; }
  if (viewed >= 1 && viewed <= 10) { rank = 'Novice'; }
  if (viewed >= 11 && viewed <= 20) { rank = 'Fan'; }
  if (viewed >= 21) { rank = 'Movie Buff'; }

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${ rank }</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Rank extends AbstractView {
  constructor(watchedMovies){
    super();
    this._watchedMovies = watchedMovies;
  }

  getTemplate() {
    return createRankTemplate(this._watchedMovies);
  }
}
