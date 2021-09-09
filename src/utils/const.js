/*
* Неизменяемые значения в приложении
* */
const Films = {
  FILMS_COUNT: 11,
  SHOW_FILMS: 5,
  SHOW_FILMS_EXTRA: 2,
  FILMS_LOAD_MORE: 5,
  TOTAL_MOVIES: 9999,
};

const getExtraTypeFilms = (films) => ({
  topRated: films
    .slice()
    .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
    .slice(0, Films.SHOW_FILMS_EXTRA),
  mostCommented: films
    .slice()
    .sort((a, b) => b.comments.size - a.comments.size)
    .slice(0, Films.SHOW_FILMS_EXTRA),
});

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

// семантическое версионирование
const UpdateType = {
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

const COUNTRIES = [
  'USA',
  'ALBANIA',
  'TAJIKISTAN',
  'FINLAND',
  'USSR',
];

const GENRES = [
  'Musical',
  'Drama',
  'Thriller',
  'Comedy',
  'Historical',
];

export {
  SortType,
  UserAction,
  UpdateType,
  COUNTRIES,
  GENRES,
  Films,
  getExtraTypeFilms,
  EMOTION
};
