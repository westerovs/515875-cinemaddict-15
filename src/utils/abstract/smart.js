/*
* обновляет данные и, если нужно, вызывает перерисовку
* */
import AbstractView from './abstract-view.js';

class Smart extends AbstractView {
  constructor() {
    super();
    this._state = {};
  }

  updateState(update, doNotReplace) {
    if (!update) {
      return;
    }

    this._state = Object.assign({}, this._state, update);

    if (doNotReplace) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    // как только вызвали update - текущий становится предыдущим
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    // Вызовем метод restoreAllHandlers после перерисовки
    this.restoreAllHandlers();
  }

  restoreAllHandlers() {
    throw new Error('Абстрактный метод должен вызываться только у потомков: restoreAllHandlers');
  }
}

export default Smart;
