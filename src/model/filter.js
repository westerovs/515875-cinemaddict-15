import AbstractObserver from '../utils/abstract/abstract-observer.js';
import { FilterType } from '../utils/const.js';

export default class Filter extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this.notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
