/*
* абстрактный паттерн наблюдатель
* */

export default class AbstractObserver {
  constructor() {
    this._observers = new Set();
  }

  addObserver(observer) {
    this._observers.add(observer);
  }

  removeObserver(observer) {
    this._observers.delete(observer);
  }

  _notify(event, payload) {
    // event - кастомный эвент событие (тип обновления ) Шпионский жучок, который будет сам observer прокидывать
    // payload - полезная нагрузка ( данные ). Хранятся в модели
    // когда модель говорит презенторам, что произошло что-то, она будет сообщать
    // тип события и данные
    this._observers.forEach((observer) => observer(event, payload));
  }
}