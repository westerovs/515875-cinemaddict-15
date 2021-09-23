/*
* Неизменяемые значения в приложении
* */
const FilmCounter = {
  SHOW_FILMS: 5,
  SHOW_FILMS_EXTRA: 2,
  FILM_COUNT_PER_STEP: 5,
};

const getExtraTypeFilms = (films) => ({
  topRated: films
    .slice()
    .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
    .slice(0, FilmCounter.SHOW_FILMS_EXTRA),
  mostCommented: films
    .slice()
    .sort((a, b) => b.comments.length - a.comments.length)
    .slice(0, FilmCounter.SHOW_FILMS_EXTRA),
});

const UserAction = {
  UPDATE_FILM_CARD: 'UPDATE_FILM_CARD', // patch || MINOR
  ADD_NEW_COMMENT: 'ADD_NEW_COMMENT', // major
  DELETE_COMMENT: 'DELETE_COMMENT', // major
};

// семантическое версионирование
const UpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const EMOTION = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const KeyCode = {
  ESCAPE : 'Escape',
  ENTER: 'Enter',
};

const State = {
  SENDING_NEW_COMMENT: 'SENDING_NEW_COMMENT',
  DELETING: 'DELETING',
};

export {
  UserAction,
  UpdateType,
  FilmCounter,
  getExtraTypeFilms,
  EMOTION,
  KeyCode,
  State
};
