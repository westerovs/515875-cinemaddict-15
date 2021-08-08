import { getRandomNumber, getRandomItem } from './utils.js';
import { COUNTRIES, MONTHS } from './const.js';
import { generateFilmComments } from './comments.js';

const names = [
  'Contact',
  'Rocky',
  'The rock',
  'The walking dead',
  'Interstellar',
];

const years = [
  getRandomNumber(0, 1921, 2021),
  getRandomNumber(0, 1921, 2021),
  getRandomNumber(0, 1921, 2021),
  getRandomNumber(0, 1921, 2021),
  getRandomNumber(0, 1921, 2021),
];

const durations = [
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
];

const posters = [
  './images/posters/the-dance-of-life.jpg',
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
];

const descriptions = [
  'Cras aliquet varius magna, non porta ligula feugiat eget.Phasellus eros mauris, Sed sed nisi sed augue convallis suscipit in sed felis. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  'Non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.  sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

const genres = [
  'Musical',
  'Drama',
  'Thriller',
  'Comedy',
  'Historical',
];

const generatefilmRating = () => `${ getRandomNumber(1, 9) }.${ getRandomNumber(0, 9) }`;

const generateRandomBoolean = () => !!getRandomNumber(0, 1);

// ****************** ↓ для поп-апа ↓ ******************
const directors = [
  'James Cameron',
  'Michael Bay',
  'Tim Burton',
];

// сценаристы
const screenwriters = [
  'Anthony Mann',
  'Jack London',
  'John Tolkien',
  'Alexander Rodionovich',
  'Eduard severe',
  'Yolter Smitt',
];

// актёры
const actors = [
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryea',
  'Thiel Schweiger',
  'Sasha grey',
  'Nicolas cage',
];

const actorsSet = new Set([
  actors[getRandomItem(actors)],
  actors[getRandomItem(actors)],
  actors[getRandomItem(actors)],
]);

const release = `${ getRandomNumber(1, 31) } ${ getRandomNumber(0, MONTHS.length - 1) } ${ getRandomNumber(1920, 2019) }`;

const generateTask = () => ({
  name: names[getRandomItem(names)],
  year: years[getRandomItem(years)],
  desc: descriptions[getRandomItem(descriptions)],
  poster: posters[getRandomItem(posters)],
  genre: genres[getRandomItem(genres)],
  duration: durations[getRandomItem(durations)],
  watchlist: generateRandomBoolean(),
  watched: generateRandomBoolean(),
  favorite: generateRandomBoolean(),
  rating: generatefilmRating(),
  director: directors[getRandomItem(directors)],
  screenwriters: screenwriters[getRandomItem(screenwriters)],
  actors: actorsSet,
  country: COUNTRIES[getRandomItem(COUNTRIES)],
  month: MONTHS[getRandomItem(MONTHS)],
  release,
  comments: {
    totalComments: getRandomNumber(0, 10),
    comment: generateFilmComments(),
  },
});

export {
  generateTask
};
