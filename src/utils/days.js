/*
* библиотека для удобной работы с датами
* */

import dayjs from 'dayjs';
import isToday  from 'dayjs/plugin/isToday';
import isYesterday   from 'dayjs/plugin/isYesterday';
import { getRandomNumber } from './random.js';

dayjs.extend(isToday );
dayjs.extend(isYesterday  );

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

const getRandomDateComment = () => {
  const dayGap = getRandomNumber(-3, 3);

  return dayjs()
    .add(dayGap, 'day')
    .toDate();
};

// возвращает именованный день, до 2х дней
const isDay = (date) => {
  if (dayjs(date).isToday()) {
    return 'today';
  }
  if (dayjs(date).isYesterday()) {
    return '1 days ago';
  }
  if (dayjs(date).add(1, 'day').isYesterday()) {
    return '2 days ago';
  } else {
    return dayjs(date).format('YYYY/MM/DD HH:MM');
  }
};

export {
  getRandomDate,
  getRandomDateComment,
  isDay
};
