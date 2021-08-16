const getRandomNumber = (min = 0, max) => Math.round(Math.random() * (max - min) + min);

const getRandomItem = (items, min = 0) => items[getRandomNumber(min, items.length - 1)];

const shuffleArr = (arr) => {
  const randomIndex = getRandomNumber(0, arr.length - 1);

  arr.forEach((item, i) => [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]);

  return arr;
};

const renderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const render = (container, element, place = renderPosition.BEFOREEND) => {
  switch (place) {
    case renderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case renderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const createElement = (template) => {
  const element = document.createElement('div');
  element.innerHTML = template;

  return element.firstChild;
};

export {
  getRandomNumber,
  getRandomItem,
  shuffleArr,
  renderPosition,
  render,
  createElement
};
