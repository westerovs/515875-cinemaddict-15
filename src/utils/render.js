import Abstract from '../view/abstract.js';

const renderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const render = (container, element, place = renderPosition.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (element instanceof Abstract) {
    element = element.getElement();
  }

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

/*
  отрисовкой в DOM занимается не абстрактный класс и не компонент, а utils.
  Поэтому utils и должна удалять из DOM.
*/
const removeComponent = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Возможно удалять только компоненты!');
  }

  component.getElement().remove();
  component.removeElement();
};

export {
  renderPosition,
  render,
  createElement,
  removeComponent
};
