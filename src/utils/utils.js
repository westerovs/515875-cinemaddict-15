const getRandomNumber = (min = 0, max) => Math.round(Math.random() * (max - min) + min);

const getRandomItem = (items) => getRandomNumber(0, items.length - 1);

const render = (container, template, place = 'beforeend') => {
  if (container instanceof Element) {
    container.insertAdjacentHTML(place, template);
  }
};

export {
  getRandomNumber,
  getRandomItem,
  render
};
