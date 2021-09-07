/*
* абстрактный паттерн наблюдатель
* */

export default class AbstractObserver {
  constructor() {
    this._observers = [];
  }

  add(callback) {
    this._observers.push(callback);
  }

  // Чтобы перестать наблюдать, каждый подписчик должен передать в метод remove тот же callback.
  remove(callback) {
    this._observers = this._observers.filter((callbackInStock) => callbackInStock !== callback);
  }

  notify() {
    this._observers.forEach((callback) => callback());
  }
}
