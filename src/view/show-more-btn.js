import Abstract from './abstract.js';

export const createShowMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ShowMoreBtn extends Abstract {
  getTemplate() {
    return createShowMoreTemplate();
  }
}
