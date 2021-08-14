import { createElement } from '../utils/utils.js';

const createFilterTemplate = (filters) => {
  const { watchlist, watched, favorite } = filters;

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${ watchlist }</span></a>
        <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${ watched }</span></a>
        <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${ favorite }</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filter {
  constructor() {
    this._elem = null;
  }

  getTemplate(filters) {
    return createFilterTemplate(filters);
  }

  getElement(filters) {
    if (!this._elem) {
      this._elem = createElement(this.getTemplate(filters));
    }

    return this._elem;
  }

  remove() {
    this._elem = null;
  }
}
