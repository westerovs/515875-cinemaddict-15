import { createElement } from '../render.js';

export default class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw Error('Нельзя создать экземпляр класса. Только наследование !');
    }

    this._elem = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error('Абстрактный метод должен вызываться только у потомков: getTemplate');
  }

  getElement() {
    if (!this._elem) {
      this._elem = createElement(this.getTemplate());
    }

    return this._elem;
  }

  removeElement() {
    this._elem = null;
  }
}

