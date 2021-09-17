import MoviesModel from './model/movies-model.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
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

  updateMovies(film) {
    // обновление фильмов
    return this._load({
      url: `movies/${ film.id }`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptToServer(film)), // преобразуем объект в строку
      headers: new Headers({ 'Content-Type': 'application/json' }), // тип содержимого
    })
      .then(Api.toJSON)
      .then(MoviesModel.adaptToClient);
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
    // todo оптимизировать до "ok" if (!response.ok)
    if (// от 200 до 299
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
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
