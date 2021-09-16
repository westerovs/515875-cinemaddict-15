import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
/* eslint-disable */
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
const getMostFrequentlyRepeatedItems = (arr) => arr.reduce((acc, item) => (typeof acc[item] !== 'undefined')
  ? { ...acc, [item]: acc[item] + 1 }
  : { ...acc, [item]: 1 }, {});


const getTotalDuration = (films) => films.reduce((acc, film) => {
  const hour = parseInt(film.filmInfo.runTime.hour, 10) * 60;
  const minute = parseInt(film.filmInfo.runTime.minute, 10);

  acc += hour + minute;

  return acc;
}, 0);

// просмотренные фильмы в диапазоне
const getWatchedFilmsInDateRange = (films, dateFrom, dateTo, currentInput) => {
  if (currentInput === TypeOfStatistics.ALL_TIME) {
    return films.filter((film) => dayjs(film.userDetails.watchingDate).isSameOrBefore(dayjs()));
  }
  if (currentInput === TypeOfStatistics.TODAY) {
    return films.filter((film) => dayjs(film.userDetails.watchingDate).isSame(dateTo, 'day'));
  }

  return films.filter((film) =>
    dayjs(film.userDetails.watchingDate).isSame(dateFrom, 'day') ||
    dayjs(film.userDetails.watchingDate).isBetween(dateFrom, dateTo) ||
    dayjs(film.userDetails.watchingDate).isSame(dateTo, 'day'),
  );
};

// возвращает все данные для графика
const getDataHistoryFilms = (films, dateFrom, dateTo, currentInput) => {
  const filmsFromRange = getWatchedFilmsInDateRange(films, dateFrom, dateTo, currentInput);

  const historyFilms = filmsFromRange.filter((item) => item.userDetails.isAlreadyWatched ? item.userDetails.isAlreadyWatched : '');
  const watchedFilmsCount = historyFilms.length;
  const totalDuration = getTotalDuration(historyFilms);

  // *** вычисление топ жанров из просмотренных фильмов ***
  // жанры просмотренных фильмов
  const repeatingGenresHistoryFilms = historyFilms
    .map((film) => [...film.filmInfo.genre])
    .flat(1);

  const filteredByTopGenres = getMostFrequentlyRepeatedItems(repeatingGenresHistoryFilms);

  const getTopGenre = () =>  Object.entries(filteredByTopGenres)
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
  getDataHistoryFilms
};
