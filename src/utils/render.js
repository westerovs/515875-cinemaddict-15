/*
* Методы для работы с DOM
* */

import Abstract from './abstract/abstract.js';

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

// Отрисовкой в DOM занимается не абстрактный класс, а utils. Поэтому utils и удаляет
const removeComponent = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Возможно удалять только компоненты!');
  }

  component.getElement().remove();
  component.removeElement();
};

// todo / слишком сложно / Лучше сделать нормально
// обновляет список фильмов, или возвращает как есть
// const update = (items, updateItem) => {
//   const index = items.findIndex((item) => item.id === updateItem.id);
//
//   if (index === -1) {
//     return items;
//   }
//
//   return [
//     ...items.slice(0, index),
//     updateItem,
//     ...items.slice(index + 1),
//   ];
// };

const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || newChild === null) {
    throw new Error('Возможно заменять только компоненты!');
  }

  parent.replaceChild(newChild, oldChild);
};

export {
  renderPosition,
  render,
  createElement,
  removeComponent,
  replace
};
