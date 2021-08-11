import dayjs from 'dayjs';
import { getRandomNumber } from './utils.js';

const getRandomDate = () => {
  const daysGap = getRandomNumber(-31, 31);
  const yearsGap = getRandomNumber(-10, 10);
  const monthGap = getRandomNumber(-10, 10);
  const hourGap = getRandomNumber(0, 24);
  const minuteGap = getRandomNumber(0, 60);

  return dayjs()
    .add(daysGap, 'year')
    .add(monthGap, 'month')
    .add(yearsGap, 'day')
    .add(hourGap, 'hour')
    .add(minuteGap, 'minute')
    .toDate();
};

export {
  getRandomDate
};
