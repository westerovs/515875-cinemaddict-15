/* eslint-disable */

/*
*  Создайте класс для презентера списка фильмов и для презентера фильма (например, MovieList и Movie).
*
*  Конструктор презентера должен принимать необходимые данные.
*
*  Разнесите по презентерам всю логику по отрисовке фильмов и кнопки «Show more»,
*  а также по навешиванию на них обработчиков, из main.js.
*
*  В main.js создайте экземпляры презентеров, передайте данные и инициализируйте их.
* */

export default class Movies {
  constructor() {

  }

  renderFilmEdit() {

  }

  renderFilm() {

  }

  renderFilmsBoard() {

  }

  init() {
    console.log('init')
    this.renderFilmEdit();
    this.renderFilm();
    this.renderFilmsBoard();
  }
}
