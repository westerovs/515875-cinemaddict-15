import AbstractObserver from '../utils/abstract/abstract-observer.js';
import { FilterType } from '../utils/const.js';

export default class Filter extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  setFilter(filter, updateType) {
    this._activeFilter = filter;
    if(updateType){
      this.notify(updateType, filter);
    }
  }

  getFilter() {
    return this._activeFilter;
  }
}
