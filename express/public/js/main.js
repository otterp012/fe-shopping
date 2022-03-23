import Dropdown from './search/dropdown.js';
import InputEvent from './search/input-form/input-event.js';
import Carousel from './carousel/carousel.js';
import Category from './category/category.js';

(() => {
  const dropdown = new Dropdown();
  const inputEvent = new InputEvent();
  const carousel = new Carousel();
  const category = new Category();
  dropdown.addBtnEvent();
  inputEvent.addInputEvent();
  carousel.startSlide();
  category.addMouseEvent();
})();
