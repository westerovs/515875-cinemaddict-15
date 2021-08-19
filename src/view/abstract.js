import { createElement } from '../utils/utils.js';

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw Error('Нельзя создать экземпляр класса. Только наследование !');
    }

    this._elem = null;
  }

  getTemplate() {
    throw new Error('Абстрактный метод должен вызываться только у потомков');
  }

  getElement() {
    if (!this._elem) {
      this._elem = createElement(this.getTemplate());
    }

    return this._elem;
  }

  remove() {
    this._elem = null;
  }
}

