/*
* главный класс Model
* */

import AbstractObserver from '../utils/abstract/abstract-observer.js';

export default class MoviesModel extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  getFilms() {
    return this._films;
  }

  setFilms(films) {
    this._films = films.slice();
  }

  // когда в презенторе хотим что-то изменить в модели, вызывает этот метод
  // куда мы сообщаем тип обновления - сам объект обновления
  updateFilm(updateType, updateItem) {
    // updateType - это абстрактный event, его нет в модели, он никуда не записывается
    // он вызывается в презенторе

    // переносим ту функциональность, которая была заложена в утилитах
    const index = this._films.findIndex((film) => film.id === updateItem.id);

    if (index === -1) {
      throw new Error('Нельзя обновить несуществующий фильм');
    }

    this._films = [
      ...this._films.slice(0, index),
      updateItem,
      ...this._films.slice(index + 1),
    ];

    this.notify(updateType, updateItem);
  }
}
