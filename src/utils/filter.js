/*
*  Функция фильтрации
* */

const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const FilteredFilms = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.isAlreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.isFavorite),
};

export {
  FilterType,
  FilteredFilms
};
