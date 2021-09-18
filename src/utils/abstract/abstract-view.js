import { createElement } from '../render.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

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

  // для будущей анимации
  shake(element, callback) {
    element.style.animation = `shake ${ SHAKE_ANIMATION_TIMEOUT / 1000 }s`;

    setTimeout(() => {
      element.style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}

