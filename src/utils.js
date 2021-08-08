const getRandomNumber = (min = 0, max) => Math.round(Math.random() * (max - min) + min);

const getRandomItem = (items) => getRandomNumber(0, items.length - 1);

export {
  getRandomNumber,
  getRandomItem
};
