import dayjs from 'dayjs';

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const sortDateDown = (a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date));

const sortRatingDown = (a, b) => +b.filmInfo.totalRating - +a.filmInfo.totalRating;

export {
  SortType,
  sortDateDown,
  sortRatingDown
};
