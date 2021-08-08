import { getRandomNumber } from './utils.js';

// комментарии — это отдельная структура данных
// с эмоцией, датой, автором и сообщением

const filmNames = [
  'Contact',
  'Rocky',
  'The rock',
  'The walking dead',
  'Interstellar',
];

const filmYears = [
  getRandomNumber(1929, 2021),
  getRandomNumber(1929, 2021),
  getRandomNumber(1929, 2021),
  getRandomNumber(1929, 2021),
  getRandomNumber(1929, 2021),
];

const filmDurations = [
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
];

const filmPosters = [
  './images/posters/the-dance-of-life.jpg',
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
];

const filmDescriptions = [
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  'Non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

const filmGenres = [
  'Musical',
  'Drama',
  'Thriller',
  'Comedy',
  'Historical',
];

const generateRandomBoolean = () => !!getRandomNumber(0, 1);

const generateTask = () => ({
  name: filmNames[getRandomNumber(0, filmNames.length - 1)],
  year: filmYears[getRandomNumber(0, filmYears.length - 1)],
  desc: filmDescriptions[getRandomNumber(0, filmDescriptions.length - 1)],
  poster: filmPosters[getRandomNumber(0, filmPosters.length - 1)],
  genre: filmGenres[getRandomNumber(0, filmGenres.length - 1)],
  duration: filmDurations[getRandomNumber(0, filmDurations.length - 1)],
  watchlist: generateRandomBoolean(),
  watched: generateRandomBoolean(),
  favorite: generateRandomBoolean(),
  extra: {
    topRated: false,
    mostCommented: false,
  },
});

export {
  generateTask
};
