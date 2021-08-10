import { getRandomNumber, getRandomItem } from '../utils.js';
import { COUNTRIES, MONTHS, GENRES } from '../const.js';
import { comments } from './comments.js';

const generateRandomBoolean = () => !!getRandomNumber(0, 1);

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

const generateFilmRating = () => `${ getRandomNumber(1, 9) }.${ getRandomNumber(0, 9) }`;

// ↓ для поп-апа ↓
const originalNames = [
  'The Great Flamarion',
  'Psycho was originally named Wimpy',
  'Rorys First Kiss',
  'The Great Flamarion',
  'American Girls',
];

const directors = [
  'James Cameron',
  'Michael Bay',
  'Tim Burton',
];

const screenwriters = [
  'Anthony Mann',
  'Jack London',
  'John Tolkien',
  'Alexander Rodionovich',
  'Eduard severe',
  'Yolter Smitt',
];

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

const genresSet = new Set([
  GENRES[getRandomItem(GENRES)],
  GENRES[getRandomItem(GENRES)],
  GENRES[getRandomItem(GENRES)],
  GENRES[getRandomItem(GENRES)],
  GENRES[getRandomItem(GENRES)],
]);

const screenwritersSet = new Set([
  screenwriters[getRandomItem(screenwriters)],
  screenwriters[getRandomItem(screenwriters)],
  screenwriters[getRandomItem(screenwriters)],
]);

const release = `${ getRandomNumber(1, 31) } ${ MONTHS[getRandomItem(MONTHS)] } ${ getRandomNumber(1921, 2021) }`;

const ageRating = `${ getRandomNumber(6, 18) }+`;

// index - временный id. Для удобства
const generateTask = (index) => ({
  id: index,
  name: names[getRandomItem(names)],
  originalName: originalNames[getRandomItem(originalNames)],
  year: years[getRandomItem(years)],
  desc: descriptions[getRandomItem(descriptions)],
  poster: posters[getRandomItem(posters)],
  genre: GENRES[getRandomItem(GENRES)],
  genresDetails: genresSet,
  duration: durations[getRandomItem(durations)],
  watchlist: generateRandomBoolean(),
  watched: generateRandomBoolean(),
  favorite: generateRandomBoolean(),
  rating: generateFilmRating(),
  director: directors[getRandomItem(directors)],
  screenwriters: screenwritersSet,
  actors: actorsSet,
  country: COUNTRIES[getRandomItem(COUNTRIES)],
  month: MONTHS[getRandomItem(MONTHS)],
  release,
  ageRating,
  comments,
});

const generateTask2 = (index = 0) => ({
  'id': index,
  'comments': comments,
  'film_info': {
    'title': names[getRandomItem(names)],
    'alternative_title': originalNames[getRandomItem(originalNames)],
    'total_rating': generateFilmRating(),
    'poster': posters[getRandomItem(posters)],
    'age_rating': ageRating,
    'director': directors[getRandomItem(directors)],
    'writers': screenwritersSet,
    'actors': actorsSet,
    'release': {
      'date': '2019-05-11T00:00:00.000Z',
      'release_country': COUNTRIES[getRandomItem(COUNTRIES)],
    },
    'runtime': durations[getRandomItem(durations)],
    'genre': GENRES[getRandomItem(GENRES)],
    'description': descriptions[getRandomItem(descriptions)],
  },
  'user_details': {
    'watchlist': generateRandomBoolean(),
    'already_watched': generateRandomBoolean(),
    'watching_date': '2019-04-12T16:12:32.554Z',
    'favorite': generateRandomBoolean(),
  },
});

export {
  generateTask,
  generateTask2
};
