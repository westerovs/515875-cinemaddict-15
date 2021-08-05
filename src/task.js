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
  'Burlesque comic Ralph Skid Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at',
  'Sentenced for a murder he did not commit, John Brant escapes from prison determined to find the real killer. By chance Brant narrow',
  'Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums and a new outlook',
  'The Martians Momar (Mom Martian) and Kimar (King Martian) are worried that their children Girmar (Girl Martian) and Bomar',
  'In this short, Sindbad the Sailor (presumably Bluto playing a role) proclaims himself, in song, to be the greatest sailor, adventurer',
];

const filmGenres = [
  'Musical',
  'Drama',
  'Thriller',
  'Comedy',
  'Historical',
];


const generateTask = () => {
  const generateRandomBoolean = () => !!getRandomNumber(0, 1);

  return {
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
  };
};

export {
  generateTask
};
