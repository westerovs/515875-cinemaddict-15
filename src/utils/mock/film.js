// import dayjs from 'dayjs';
// import { nanoid } from 'nanoid';
// import { getRandomNumber, getRandomItem, shuffleArr } from '../random.js';
// import { getRandomDate } from '../days.js';
// import { COUNTRIES, GENRES } from '../const.js';
// import { getComments } from './comments.js';
//
// const generateRandomBoolean = () => !!getRandomNumber(0, 1);
//
// const titles = [
//   'Contact',
//   'Rocky',
//   'Blue Lagoon',
//   'The walking dead',
//   'Interstellar',
// ];
//
// const getRunTimes = () => ({
//   hour: `${ getRandomNumber(0, 3) }h`,
//   minute: `${ getRandomNumber(0, 60) }m`,
// });
//
// const posters = [
//   'the-dance-of-life.jpg',
//   'made-for-each-other.png',
//   'popeye-meets-sinbad.png',
//   'sagebrush-trail.jpg',
//   'santa-claus-conquers-the-martians.jpg',
// ];
//
// const getDescriptions = () => {
//   const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
//   const textPartsLength = text.split('.').length;
//
//   return text.split('.', getRandomNumber(0, textPartsLength)).join('. ');
// };
//
// const getTotalRating = () => `${ getRandomNumber(-9, 9) }.${ getRandomNumber(0, 9) }`;
//
// // ↓ для поп-апа ↓
// const alternativeTitles = [
//   'The Great Flamarion',
//   'Psycho was originally named Wimpy',
//   'Rorys First Kiss',
//   'The Great Flamarion',
//   'American Girls',
// ];
//
// const directors = [
//   'James Cameron',
//   'Michael Bay',
//   'Tim Burton',
// ];
//
// const getWriters = () => {
//   const screenwriters = [
//     'Anthony Mann',
//     'Jack London',
//     'John Tolkien',
//     'Alexander Rodionovich',
//     'Eduard severe',
//     'Yolter Smitt',
//   ];
//
//   return shuffleArr(screenwriters).slice(0, getRandomNumber(1, screenwriters.length - 1));
// };
//
// const getActors = () => {
//   const actors = [
//     'Erich von Stroheim',
//     'Mary Beth Hughes',
//     'Dan Duryea',
//     'Thiel Schweiger',
//     'Sasha grey',
//     'Nicolas cage',
//   ];
//
//   return shuffleArr(actors).slice(0, getRandomNumber(1, actors.length - 1));
// };
//
// const getRelease = () => {
//   const date = getRandomDate();
//   return dayjs(date);
// };
//
// const getGenres = () => shuffleArr(GENRES).slice(0, getRandomNumber(1, GENRES.length - 1));
//
// const getAgeRating = () => getRandomNumber(6, 18);
//
// const getId = () => nanoid();
//
// const generateFilm = () => ({
//   id: getId(),
//   comments: getComments(),
//   filmInfo: {
//     title: getRandomItem(titles),
//     alternativeTitle: getRandomItem(alternativeTitles),
//     totalRating: getTotalRating(),
//     poster: getRandomItem(posters),
//     ageRating: getAgeRating(),
//     director: getRandomItem(directors),
//     writers: getWriters(),
//     actors: getActors(),
//     release: {
//       date: getRelease(),
//       releaseCountry: getRandomItem(COUNTRIES),
//     },
//     runTime: getRunTimes(),
//     genre: getGenres(),
//     description: getDescriptions(),
//   },
//   userDetails: {
//     isWatchlist: generateRandomBoolean(),
//     isAlreadyWatched: generateRandomBoolean(),
//     isFavorite: generateRandomBoolean(),
//     watchingDate: null, // ! внимание ( было getRandomDate)
//   },
// });
//
// export {
//   generateFilm
// };
