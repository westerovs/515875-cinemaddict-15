/*
* Неизменяемые значения в приложении
* */
const Films = {
  FILMS_COUNT: 44,
  SHOW_FILMS: 5,
  SHOW_FILMS_EXTRA: 2,
  FILM_COUNT_PER_STEP: 5,
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

// семантическое версионирование
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FilterType = {
  ALL: 'ALL',
  WATCHLIST: 'WATCHLIST',
  HISTORY: 'HISTORY',
  FAVORITES: 'FAVORITES',
};

const UserAction = {
  UPDATE_FILM_CARD: 'UPDATE_FILM_CARD',
  ADD_NEW_COMMENT: 'ADD_NEW_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const EMOTION = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const COUNTRIES = [
  'Usa',
  'Albania',
  'Tajikistan',
  'Finland',
  'Ussr',
];

const GENRES = [
  'Musical',
  'Drama',
  'Thriller',
  'Comedy',
  'Historical',
];

const KeyCodes = {
  ESCAPE : 'Escape',
  ENTER: 'Enter',
};

export {
  SortType,
  FilterType,
  UserAction,
  UpdateType,
  COUNTRIES,
  GENRES,
  Films,
  getExtraTypeFilms,
  EMOTION,
  KeyCodes
};
