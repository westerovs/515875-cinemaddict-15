/*
* главный класс Model
* */

/*
updateFilm(updateType, updateElement)
  когда в презенторе хотим что-то изменить в модели, вызываем этот метод
  куда мы сообщаем тип обновления - сам объект обновления
*/


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

  updateFilm(updateType, updateElement) {
    // updateType - вызывается в презенторе, это абстрактный event, его нет в модели, он никуда не записывается
    const index = this._films.findIndex((film) => film.id === updateElement.id);

    if (index === -1) {
      throw new Error('Нельзя обновить несуществующий фильм');
    }

    this._films = [
      ...this._films.slice(0, index),
      updateElement,
      ...this._films.slice(index + 1),
    ];

    this.notify(updateType, updateElement);
  }

  addComment(updateType, updateElement) {
    this._tasks = [
      updateElement,
      ...this._tasks,
    ];

    this.notify(updateType, updateElement);
  }

  deleteComment(updateType, updateElement) {
    const index = this._tasks.findIndex((task) => task.id === updateElement.id);

    if (index === -1) {
      throw new Error('Нельзя удалить несуществующий фильм');
    }

    this._tasks = [
      ...this._tasks.slice(0, index),
      ...this._tasks.slice(index + 1),
    ];

    this.notify(updateType);
  }
}
