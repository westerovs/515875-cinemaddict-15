import AbstractView from '../../utils/abstract/abstract-view.js';
import { FilterType } from '../../utils/filter.js';

const EmptyFilmListTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoFilmLsTemplate = (filterType) => {
  const emptyFilmsListTextValue = EmptyFilmListTextType[filterType];

  return `<section class="films-list">
            <h2 class="films-list__title">${ emptyFilmsListTextValue }</h2>
          </section>`;
};

export default class NoFilms extends AbstractView {
  constructor(data){
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoFilmLsTemplate(this._data);
  }
}

