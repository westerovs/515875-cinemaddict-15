import { getRandomNumber, getRandomItem } from '../utils/random.js';
import { getRandomDateComment } from '../utils/days.js';

const emotion = [
  'smile',
  'sleeping',
  'puke',
  'angry',
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
  author: getRandomItem(filmAuthor),
  comment: getRandomItem(filmDesc),
  date: getRandomItem(filmDates),
  emotion: getRandomItem(emotion),
});

const getComments = () => new Set(
  new Array(getRandomNumber(0, 15))
    .fill('')
    .map(() => filmComments()),
);

export {
  getComments
};
