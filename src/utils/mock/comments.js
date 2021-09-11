import { nanoid } from 'nanoid';
import { getRandomNumber, getRandomItem } from '../random.js';
import { getRandomDateComment } from '../days.js';
import { EMOTION } from '../const.js';

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

const getId = () => nanoid();

const filmComments = () => ({
  id: getId(),
  author: getRandomItem(filmAuthor),
  comment: getRandomItem(filmDesc),
  date: getRandomItem(filmDates),
  emotion: getRandomItem(EMOTION),
});

const getComments = () => new Set(
  new Array(getRandomNumber(0, 25))
    .fill('')
    .map(() => filmComments()),
);

export {
  getComments
};
