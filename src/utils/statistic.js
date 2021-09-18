import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

const TypeOfStatistics = {
  ALL_TIME: 'all time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

// абстрактная ф-ция для нахождения наиболее часто повторяющихся значений в массиве
const getMostFrequentlyRepeatedItems = (arr) => (
  arr.reduce((acc, item) => (typeof acc[item] !== 'undefined')
    ? { ...acc, [item]: acc[item] + 1 }
    : { ...acc, [item]: 1 }, {})
);

const calculateRuntime = (runtime) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${ hours }h ${ minutes }m`;
};

const getTotalDuration = (films) => films.reduce((acc, film) => {
  const durationFilm = film.filmInfo.runTime;
  acc += durationFilm;

  return acc;
}, 0);

// просмотренные фильмы в диапазоне
const filterMoviesByPeriod = (films, dateFrom, dateTo, currentInput) => {
  switch (currentInput) {
    case TypeOfStatistics.ALL_TIME:
      return films;
    case TypeOfStatistics.TODAY:
      return films.filter((film) => dayjs(film.userDetails.watchingDate).isSame(dateTo, 'day'));
    case TypeOfStatistics.WEEK:
      return films.filter((film) => dayjs(film.userDetails.watchingDate).isSame(dateTo, 'week'));
    case TypeOfStatistics.MONTH:
      return films.filter((film) => dayjs(film.userDetails.watchingDate).isSame(dateTo, 'month'));
    case TypeOfStatistics.YEAR:
      return films.filter((film) => dayjs(film.userDetails.watchingDate).isSame(dateTo, 'year'));
  }
};

// возвращает все данные для графика
const getDataHistoryFilms = (films, dateFrom, dateTo, currentInput) => {
  const filmsFromRange = filterMoviesByPeriod(films, dateFrom, dateTo, currentInput);

  const historyFilms = filmsFromRange.filter((item) => item.userDetails.isAlreadyWatched ? item.userDetails.isAlreadyWatched : '');
  const watchedFilmsCount = historyFilms.length;
  const totalDuration = getTotalDuration(historyFilms);

  // ↓ вычисление топ жанров из просмотренных фильмов ↓
  const repeatingGenresHistoryFilms = historyFilms.map((film) => [...film.filmInfo.genre]).flat(1);
  const filteredByTopGenres = getMostFrequentlyRepeatedItems(repeatingGenresHistoryFilms);

  const getTopGenre = () => Object.entries(filteredByTopGenres)
    .reduce((acc, curr) => acc[1] > curr[1] ? acc : curr)[0];

  return {
    watchedFilmsCount,
    totalDuration,
    topGenre: getTopGenre,
    filteredByTopGenres: {
      genre: Object.keys(filteredByTopGenres),
      value: Object.values(filteredByTopGenres),
    },
  };
};

export {
  getTotalDuration,
  TypeOfStatistics,
  getMostFrequentlyRepeatedItems,
  getDataHistoryFilms,
  calculateRuntime
};
