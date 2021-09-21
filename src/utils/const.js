/*
* Неизменяемые значения в приложении
* */
const Films = {
  SHOW_FILMS: 5,
  SHOW_FILMS_EXTRA: 2,
  FILM_COUNT_PER_STEP: 5,
};

const getExtraTypeFilms = (films) => ({
  topRated: films
    .slice()
    .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
    .slice(0, Films.SHOW_FILMS_EXTRA),
  mostCommented: films
    .slice()
    .sort((a, b) => b.comments.length - a.comments.length)
    .slice(0, Films.SHOW_FILMS_EXTRA),
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

const KeyCodes = {
  ESCAPE : 'Escape',
  ENTER: 'Enter',
};

// todo возможно добавить потом для удобства
// const isCtrlEnterPressed = (evt) => evt.key === KeyCodes.ENTER && evt.ctrlKey;

// todo возможно добавить потом для удобства
// const isEscPressed = (evt) => evt.code === KeyCodes.ESCAPE || evt.key === 'Esc';

const State = {
  SENDING_NEW_COMMENT: 'SENDING_NEW_COMMENT',
  DELETING: 'DELETING',
};

export {
  UserAction,
  UpdateType,
  Films,
  getExtraTypeFilms,
  EMOTION,
  KeyCodes,
  State
};
