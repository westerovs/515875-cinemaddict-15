import MoviesModel from './model/movies-model.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint; // ← передаём ссылку на адрес сервера
    // ↓ все запросы, которые мы передаём серверу, должны содержать строку авторизации(токен)
    this._authorization = authorization;
  }

  getMovies() {
    // при выполнении метода, будет отправлен запрос на получение фильмов
    return this._load({ url: 'movies' }) // в настройках передаём ключ movies
      .then(Api.toJSON)
      .then((films) => films.map(MoviesModel.adaptToClient));

  }

  updateMovies(movie) {
    return this._load({
      url: `movies/${ movie.id }`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptToServer(movie)), // преобразуем объект в строку
      headers: new Headers({ 'Content-Type': 'application/json' }), // тип содержимого
    })
      .then(Api.toJSON)
      .then(MoviesModel.adaptToClient);
  }

  getComments(film) {
    return this._load({ url: `comments/${ film.id }` })
      .then(Api.toJSON);
  }

  addNewComment(movie) { // принимает текущий pop-up
    // при вызове должен быть выполнен метод load с http методом POST
    // и то что пользователь ввёл, должно быть отправлено на сервер
    return this._load({
      url: `comments/${ movie.id }`,
      method: Method.POST,
      body: JSON.stringify(movie.newComment),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then((response) => response = response.movie)
      .then(MoviesModel.adaptToClient);
  }

  deleteComment(film) {
    return this._load({
      url: `comments/${ film.commentToDelete.id }`,
      method: Method.DELETE,
    });
  }

  // что бы не вызывать fetch в каждом методе, заведём метод _load
  // к нему будут обращаться другие методы и передавать настройки
  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    // добавить заголовок Authorization
    headers.append('Authorization', this._authorization);

    return fetch(
      `${ this._endPoint }/${ url }`, // адрес сервера, куда будем передавать запрос и / url (movies, comments)
      { method, body, headers },
    ) // объект с настройками
      .then(Api.checkStatus) // передаём ссылку на стат. метод(проверка статуса)
      .catch(Api.catchError); // обработка ошибок
  }

  // когда промис зарезолвится, будет вызван checkStatus
  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${ response.status }: ${ response.statusText }`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json(); // вызывает метод у объекта ответа и преобразует ответ-строку в объект json
  }

  static catchError(err) {
    throw err;
  }
}
