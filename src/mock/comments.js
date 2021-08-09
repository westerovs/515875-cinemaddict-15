import { getRandomNumber, getRandomItem } from '../utils.js';

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
  emoji: filmEmoji[getRandomItem(filmEmoji)],
  text: filmDesc[getRandomItem(filmDesc)],
  author: filmAuthor[getRandomItem(filmAuthor)],
  date: filmDates[getRandomItem(filmAuthor)],
});

const comments = new Set(
  new Array(getRandomNumber(1, 15))
    .fill('')
    .map(() => filmComments()),
);

export {
  comments
};
