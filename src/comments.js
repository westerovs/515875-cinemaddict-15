import { getRandomNumber } from './utils.js';

const filmEmoji = [
  './images/emoji/smile.png',
  './images/emoji/angry.png',
  './images/emoji/puke.png',
  './images/emoji/sleeping.png',
];

const filmDesc = [
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
];

const filmAuthor = [
  'John Doe',
  'Tim Macoveev',
  'Arnold Blackborn',
  'Tim Traice',
];

const filmDate = [
  'Today',
];


const generateFilmComments = () => ({
  emoji: filmEmoji[getRandomNumber(0, filmEmoji.length - 1)],
  desc: filmDesc[getRandomNumber(0, filmDesc.length - 1)],
  author: filmAuthor[getRandomNumber(0, filmAuthor.length - 1)],
  date: 'Today',
});

export {
  generateFilmComments
};
