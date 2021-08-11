import { getRandomNumber, getRandomItem } from '../utils/utils.js';
import { getRandomDate } from '../utils/days.js';
import { COUNTRIES, GENRES } from '../const.js';
import { comments } from './comments.js';

const generateRandomBoolean = () => !!getRandomNumber(0, 1);

const title = [
  'Contact',
  'Rocky',
  'The rock',
  'The walking dead',
  'Interstellar',
];

const runtime = [
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

const totalRating = () => `${ getRandomNumber(1, 9) }.${ getRandomNumber(0, 9) }`;

// ↓ для поп-апа ↓
const alternativeTitles = [
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

const getActors = () => {
  const actors = [
    'Erich von Stroheim',
    'Mary Beth Hughes',
    'Dan Duryea',
    'Thiel Schweiger',
    'Sasha grey',
    'Nicolas cage',
  ];

  return new Set([
    actors[getRandomItem(actors)],
    actors[getRandomItem(actors)],
    actors[getRandomItem(actors)],
  ]);
};

const genres = new Set([
  GENRES[getRandomItem(GENRES)],
  GENRES[getRandomItem(GENRES)],
  GENRES[getRandomItem(GENRES)],
]);

const writers = new Set([
  screenwriters[getRandomItem(screenwriters)],
  screenwriters[getRandomItem(screenwriters)],
  screenwriters[getRandomItem(screenwriters)],
]);

const ageRating = `${ getRandomNumber(6, 18) }+`;

const generateTask = (index = 0) => ({
  id: index,
  comments: comments,
  filmInfo: {
    title: title[getRandomItem(title)],
    alternativeTitle: alternativeTitles[getRandomItem(alternativeTitles)],
    totalRating: totalRating(),
    poster: posters[getRandomItem(posters)],
    ageRating: ageRating,
    director: directors[getRandomItem(directors)],
    writers: writers,
    actors: getActors(),
    release: {
      date: getRandomDate,
      releaseCountry: COUNTRIES[getRandomItem(COUNTRIES)],
    },
    runtime: runtime[getRandomItem(runtime)],
    genre: GENRES[getRandomItem(GENRES)],
    genresDetails: genres,
    description: descriptions[getRandomItem(descriptions)],
  },
  userDetails: {
    watchlist: generateRandomBoolean(),
    alreadyWatched: generateRandomBoolean(),
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: generateRandomBoolean(),
  },
});

export {
  generateTask
};
