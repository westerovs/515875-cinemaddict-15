import AbstractObserver from '../utils/abstract/abstract-observer.js';
import { FilterType } from '../utils/filter.js';

export default class FilterModel extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  setActiveFilter(updateType, filter) {
    // установка фильтра значит изменение данных модели и уведомления всех, кто подписался
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getActiveFilter() {
    return this._activeFilter;
  }
}
