import dayjs from 'dayjs';

const getRandomNumber = (min = 0, max) => Math.round(Math.random() * (max - min) + min);

const getRandomItem = (items) => getRandomNumber(0, items.length - 1);

const render = (container, template, place = 'beforeend') => {
  // если не найдёт querySelector, то код не упадёт из-за null, т.к проверка instanceof
  if (container instanceof Element) {
    container.insertAdjacentHTML(place, template);
  }
};

export {
  getRandomNumber,
  getRandomItem,
  render
};
