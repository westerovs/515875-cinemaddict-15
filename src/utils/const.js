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

// семантическое версионирование
const UpdateType = {
  PATCH: 'patch',
  MINOR: 'minor',
  MAJOR: 'major',
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const UserAction = {
  UPDATE_FILM_CARD: 'update_film_card',
  ADD_NEW_COMMENT: 'add_new_comment',
  DELETE_COMMENT: 'delete_comment',
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
