const getRandomNumber = (min = 0, max) => Math.round(Math.random() * (max - min) + min);

const getRandomItem = (items, min = 0) => items[getRandomNumber(min, items.length - 1)];

// для удобной генерации неповторяющихся, рандомных items
const getRandomUniqueItems = (items) => {
  const set = new Set();

  for (const item of items) {
    set.add(item);
  }

  return [...set]
    .slice(0, getRandomNumber(0, items.length - 1))
    .join(', ');
};

const render = (container, template, place = 'beforeend') => {
  if (container instanceof Element) {
    container.insertAdjacentHTML(place, template);
  }
};

export {
  getRandomNumber,
  getRandomItem,
  getRandomUniqueItems,
  render
};
