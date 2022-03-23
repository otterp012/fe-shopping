import { $, $$, fetchData } from '../utility/util.js';
import RenderCarousel from './render-carousel.js';
import SideMenu from './sub-menu.js';

export default class Carousel {
  constructor() {
    this.renderCarousel = new RenderCarousel();
    this.sideMenu = new SideMenu();
    this.mainContainer = $('.image-container');
    this.sideTab = $('.slide-tab-container');
  }

  async startSlide() {
    const carouselData = await fetchData('/carouselData');

    this.renderCarousel.renderMainImage(carouselData, this.mainContainer);
    this.renderCarousel.renderSubMenu(carouselData, this.sideTab);
    this.initCarouselInterval();
    this.addSubMenuEvent();
  }

  initCarouselInterval = () => {
    this.intervalID = setInterval(() => this.translateContainer(), 2000);
  };

  stopCarouselInterval = () => clearInterval(this.intervalID);

  translateContainer() {
    this.mainContainer.style.transitionDuration = '1ms';
    this.mainContainer.style.transform = `translateY(${-100}%)`;
    this.mainContainer.ontransitionend = () => this.changeLocationEl();
  }

  changeLocationEl() {
    this.mainContainer.removeAttribute('style');
    this.mainContainer.appendChild(this.mainContainer.firstElementChild);
  }

  addSubMenuEvent() {
    const $$sideTab = $$('.side-tab-element');

    $$sideTab.forEach((list) => {
      list.addEventListener('mouseleave', this.initCarouselInterval);
      list.addEventListener('mouseenter', ({ target }) => {
        this.stopCarouselInterval();
        this.sideMenu.findTargetImg(target);
      });
    });
  }
}
