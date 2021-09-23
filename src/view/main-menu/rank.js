import AbstractView from '../../utils/abstract/abstract-view.js';
import { UserRank } from '../../utils/const.js';

const createRankTemplate = (watchedMovies) => {
  const viewed = watchedMovies();
  let rank = null;

  if (viewed <= UserRank.NOVICE) {
    rank = 'Novice';
  }
  if (viewed >= UserRank.NOVICE && viewed <= UserRank.FAN) {
    rank = 'Fan';
  }
  if (viewed >= UserRank.MOVIE_BUFF) {
    rank = 'Movie Buff';
  }

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
