/*
* абстрактный паттерн наблюдатель
* */

const observer = {
  // ключ в котором хранятся observers (т.е слушатели)
  _observers: [],

  // метод добавляющий слушателей
  addObserver(cb) {
    this._observers.push(cb);
  },

  // метод удаляющий слушателей
  removeObserver(cb) {
    this._observers = this._observers.filter((item) => item !== cb);
  },

  // метод уведомляющий всех
  notify() {
    this._observers.forEach((item) => item());
  },
};

export {
  observer
};
