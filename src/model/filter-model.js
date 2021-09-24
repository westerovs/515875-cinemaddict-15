import AbstractObserver from '../utils/abstract/abstract-observer.js';
import { FilterType } from '../utils/filter.js';

class FilterModel extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  setActiveFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getActiveFilter() {
    return this._activeFilter;
  }
}

export default FilterModel;
