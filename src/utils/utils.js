const getRandomNumber = (min = 0, max) => Math.round(Math.random() * (max - min) + min);

const getRandomItem = (items, min = 0) => items[getRandomNumber(min, items.length - 1)];

const shuffleArr = (arr) => {
  const randomIndex = getRandomNumber(0, arr.length - 1);

  arr.forEach((item, i) => [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]);

  return arr;
};

const render = (container, template, place = 'beforeend') => {
  if (container instanceof Element) {
    container.insertAdjacentHTML(place, template);
  }
};

export {
  getRandomNumber,
  getRandomItem,
  shuffleArr,
  render
};
