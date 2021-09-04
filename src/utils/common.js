/*
* разные методы для переиспользования в проекте
* */

const clearActiveClass = (element, className) => {
  element.forEach((item) => item.classList.remove(`${ className }`));
};

export {
  clearActiveClass
};
