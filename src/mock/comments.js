import { getRandomNumber, getRandomItem } from '../utils/utils.js';

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
  'Today',
  'After',
  '2019/12/31 23:59',
  '2021/2/1 15:29',
  '2020/5/22 07:00',
];


const filmComments = () => ({
  id: 0,
  author: filmAuthor[getRandomItem(filmAuthor)],
  comment: filmDesc[getRandomItem(filmDesc)],
  date: filmDates[getRandomItem(filmAuthor)],
  emotion: emotion[getRandomItem(emotion)],
});

const comments = new Set(
  new Array(getRandomNumber(1, 15))
    .fill('')
    .map(() => filmComments()),
);

export {
  comments
};
