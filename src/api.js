import MoviesModel from './model/movies-model.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({ url: 'movies' })
      .then(Api.toJSON)
      .then((films) => films.map(MoviesModel.adaptToClient));
  }

  updateMovies(movie) {
    return this._load({
      url: `movies/${ movie.id }`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptToServer(movie)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then(MoviesModel.adaptToClient);
  }

  getComments(film) {
    return this._load({ url: `comments/${ film.id }` })
      .then(Api.toJSON);
  }

  addComments(film) {
    return this._load({
      url: 'tasks',
      method: Method.POST,
      body: JSON.stringify(MoviesModel.adaptToServer(film)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then(MoviesModel.adaptToClient);
  }

  deleteComments(film) {
    return this._load({
      url: `tasks/${ film.id }`,
      method: Method.DELETE,
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${ this._endPoint }/${ url }`,
      { method, body, headers },
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${ response.status }: ${ response.statusText }`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
