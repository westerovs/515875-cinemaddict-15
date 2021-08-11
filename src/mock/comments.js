import { getRandomNumber, getRandomItem } from '../utils/utils.js';
import { getRandomDateComment } from '../utils/days.js';

const emotion = [
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
  'Very very scary...',
];

const filmAuthor = [
  'John Doe',
  'Tim Macoveev',
  'Arnold Blackborn',
  'Tim Traice',
  'Paul Popoff',
];

const filmDates = [
  getRandomDateComment(),
  getRandomDateComment(),
  getRandomDateComment(),
  getRandomDateComment(),
  getRandomDateComment(),
];

const filmComments = () => ({
  id: getRandomNumber(0, 999),
  author: filmAuthor[getRandomItem(filmAuthor)],
  comment: filmDesc[getRandomItem(filmDesc)],
  date: filmDates[getRandomItem(filmDates)],
  emotion: emotion[getRandomItem(emotion)],
});

const comments = () => new Set(
  new Array(getRandomNumber(1, 15))
    .fill('')
    .map(() => filmComments()),
);

export {
  comments
};
