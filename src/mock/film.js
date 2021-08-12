import { getRandomNumber, getRandomItem, getRandomUniqueItems } from '../utils/utils.js';
import { getRandomDate } from '../utils/days.js';
import { COUNTRIES, GENRES } from '../const.js';
import { getComments } from './comments.js';

const generateRandomBoolean = () => !!getRandomNumber(0, 1);

const titles = [
  'Contact',
  'Rocky',
  'The rock',
  'The walking dead',
  'Interstellar',
];

const runTimes = [
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
  `${getRandomNumber(0, 3)}h ${getRandomNumber(0, 60)}m`,
];

const posters = [
  'the-dance-of-life.jpg',
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
];

const getDescriptions = () => {
  const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  const textLength = text.split(' ').length;

  return text.split(' ', getRandomNumber(0, textLength)).join(' ');
};

const getTotalRating = () => `${ getRandomNumber(-9, 9) }.${ getRandomNumber(0, 9) }`;

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

const getWriters = () => {
  const screenwriters = [
    'Anthony Mann',
    'Jack London',
    'John Tolkien',
    'Alexander Rodionovich',
    'Eduard severe',
    'Yolter Smitt',
  ];

  return getRandomUniqueItems(screenwriters);
};

const getActors = () => {
  const actors = [
    'Erich von Stroheim',
    'Mary Beth Hughes',
    'Dan Duryea',
    'Thiel Schweiger',
    'Sasha grey',
    'Nicolas cage',
  ];

  return getRandomUniqueItems(actors);
};

const getGenres = () => {
  // рандомные жанры
  const genres = new Set([
    getRandomItem(GENRES),
    getRandomItem(GENRES),
  ]);

  // главный жанр фильма
  const mainGenre = getRandomItem(GENRES);

  // поджанры для поп-апа, исключающие главный жанр
  const subGenre = [...genres].filter((genre) => {
    if (genre === mainGenre) { return; }
    return genre;
  });

  // руководствовался идеей что есть жанр и поджанры в попапе
  return {
    mainGenre,
    subGenre,
  };
};

const getAgeRating = () => [
  `${ getRandomNumber(6, 18) }+`,
  `${ getRandomNumber(6, 18) }+`,
  `${ getRandomNumber(6, 18) }+`,
  `${ getRandomNumber(6, 18) }+`,
  `${ getRandomNumber(6, 18) }+`,
];

const generateTask = (index = 0) => ({
  id: index,
  comments: getComments(),
  filmInfo: {
    title: getRandomItem(titles),
    alternativeTitle: getRandomItem(alternativeTitles),
    totalRating: getTotalRating(),
    poster: getRandomItem(posters),
    ageRating: getRandomItem(getAgeRating()),
    director: getRandomItem(directors),
    writers: getWriters(),
    actors: getActors(),
    release: {
      date: getRandomDate,
      releaseCountry: getRandomItem(COUNTRIES),
    },
    runTime: getRandomItem(runTimes),
    genre: getGenres(),
    description: getDescriptions(),
  },
  userDetails: {
    watchlist: generateRandomBoolean(),
    alreadyWatched: generateRandomBoolean(),
    watchingDate: getRandomDate(),
    favorite: generateRandomBoolean(),
  },
});

export {
  generateTask
};
