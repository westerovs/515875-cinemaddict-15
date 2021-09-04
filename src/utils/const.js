/*
* Неизменяемые значения в приложении
* */
const Films = {
  FILMS_COUNT: 20,
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
  COUNTRIES,
  GENRES,
  Films,
  getExtraTypeFilms
};
