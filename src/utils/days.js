/*
* библиотека для удобной работы с датами
* */

import dayjs from 'dayjs';
import isToday  from 'dayjs/plugin/isToday';
import isYesterday   from 'dayjs/plugin/isYesterday';

dayjs.extend(isToday );
dayjs.extend(isYesterday  );

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
  isDay
};
