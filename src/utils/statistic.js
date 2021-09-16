import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

const TypeOfStatistics = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

// просмотренные фильмы в диапазоне
const getWatchedFilmsInDateRange = (films, dateFrom, dateTo, currentInput) => {
  if (currentInput === TypeOfStatistics.ALL_TIME) {
    return films.filter((film) => dayjs(film.userDetails.isWatchingDate).isSameOrBefore(dateTo));
  }
  if (currentInput === TypeOfStatistics.TODAY) {
    return films.filter((film) => dayjs(film.userDetails.isWatchingDate).isSame(dateTo, 'day'));
  }

  return films.filter((film) =>
    dayjs(film.userDetails.isWatchingDate).isSame(dateFrom, 'day') ||
    dayjs(film.userDetails.isWatchingDate).isBetween(dateFrom, dateTo) ||
    dayjs(film.userDetails.isWatchingDate).isSame(dateTo, 'day'),
  );
};

// жанры просмотренных фильмов
const getAllWatchedFilmsGenres = (films) => {
  const genres = [];

  films.forEach((film) => {
    film.filmInfo.genre.forEach((genre) => genres.push(genre));
  });

  return genres;
};

const countFilmsByGenres = (allGenres,genre) => allGenres.filter((item) => item === genre).length;

const getWatchedFilmsChart = (films, dateTo, dateFrom, currentInput) => {
  const WatchedFilmsChart = {
    watchedFilms : [],
    uniqGenres : [],
    filmsByGenresCount : [],
  };

  WatchedFilmsChart.watchedFilms = getWatchedFilmsInDateRange(films, dateTo, dateFrom, currentInput);

  const AllWatchedFilmsGenres = getAllWatchedFilmsGenres(WatchedFilmsChart.watchedFilms);
  const uniqGenres = [...new Set(AllWatchedFilmsGenres)];
  const filmsByGenresCount = uniqGenres.map((genre) => countFilmsByGenres(AllWatchedFilmsGenres, genre));

  let genreAndCount = {};

  // добавить в объект ключ жанр и число просмотренных фильмов данного жанра
  uniqGenres.forEach((genre, index) => genreAndCount[genre] = filmsByGenresCount[index]);

  genreAndCount = Object.entries(genreAndCount)
    .sort((a, b) => b[1] - a[1])
    .forEach((genre) => {
      WatchedFilmsChart.uniqGenres.push(genre[0]);
      WatchedFilmsChart.filmsByGenresCount.push(genre[1]);
    });

  return WatchedFilmsChart;
};

export {
  getWatchedFilmsChart
};
