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
  renderPosition,
  render,
  createElement
};
