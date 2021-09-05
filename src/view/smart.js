import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._state = {};
  }

  updateState(update, doNotReplace) {
    // если ничего не обновилось, то и нехуй перерисовки вызывать
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

    // Вызовем метод restoreAllHandlers после обновления в updateElement
    this.restoreAllHandlers();
  }

  restoreAllHandlers() {
    throw new Error('Абстрактный метод должен вызываться только у потомков: resetHandlers');
  }
}
