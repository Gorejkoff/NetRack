"use strict"

// window.addEventListener('load', (event) => {});

// desktop or mobile (mouse or touchscreen)
const isMobile = {
   Android: function () { return navigator.userAgent.match(/Android/i) },
   BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i) },
   iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i) },
   Opera: function () { return navigator.userAgent.match(/Opera Mini/i) },
   Windows: function () { return navigator.userAgent.match(/IEMobile/i) },
   any: function () {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
   }
};
const isPC = !isMobile.any();
if (isPC) { document.body.classList.add('_pc') } else { document.body.classList.add('_touch') };

// media queries
const MIN1024 = window.matchMedia('(min-width: 1024px)');
const MIN768 = window.matchMedia('(min-width: 768px)');

// variables
const HEADER = document.getElementById('header');
const GALLERY_ACCORDION_LIST = document.querySelectorAll('.gallery-accordion__body .gallery-accordion__item');
const CONNECTION_SCHEME_LIST = document.querySelectorAll('.connection-scheme__cell-content');

function throttle(callee, timeout) {
   let timer = null;
   return function perform(...args) {
      if (timer) return;
      timer = setTimeout(() => {
         callee(...args);
         clearTimeout(timer);
         timer = null;
      }, timeout)
   }
}

// // Функция для получения ширины полосы прокрутки
// function getScrollbarWidth() {
//    const div = document.createElement('div');
//    div.style.cssText = `
//      width: 100px;
//      height: 100px;
//      overflow: scroll;
//      position: absolute;
//      top: -9999px;
//         `;
//    document.body.appendChild(div);
//    const scrollbarWidth = div.offsetWidth - div.clientWidth;
//    document.body.removeChild(div);
//    return scrollbarWidth;
// }
// // запсь переменной ширины полосы прокрутки
// function setVarScrollbarWidth() {
//    document.body.style.setProperty('--scrollbarWidth', getScrollbarWidth() + 'px')
// }


/* запись переменных высоты элементов */
// function addHeightVariable() {
//    if (typeof HEADER !== "undefined") {
//       document.body.style.setProperty('--height-header', `${HEADER.offsetHeight}px`)
//    }
// }
// addHeightVariable();


// ** ======================= RESIZE ======================  ** //
window.addEventListener('resize', () => {
   //  addHeightVariable();
   closeHeaderMenu();
   if (CONNECTION_SCHEME_LIST.length > 0) {
      addHeightConnectionScheme(CONNECTION_SCHEME_LIST);
   }
})


// ** ======================= CLICK ======================  ** //
document.documentElement.addEventListener("click", (event) => {
   if (event.target.closest('.open-menu')) { openHeaderMenu() };
   if (event.target.closest('.gallery-accordion__item')) { changeGalleryAccordion(event.target.closest('.gallery-accordion__item')) }
})

function openHeaderMenu() {
   document.body.classList.toggle('menu-is-open')
}
function closeHeaderMenu() {
   document.body.classList.remove('menu-is-open')
}

function changeGalleryAccordion(target) {
   if (GALLERY_ACCORDION_LIST.length > 0) {
      GALLERY_ACCORDION_LIST.forEach(e => e.classList.toggle('active', e == target))
   }
}
function addHeightConnectionScheme(list) {
   const parent = document.querySelector('.connection-scheme__item');
   let height = 0;
   list.forEach(e => {
      if (height < e.offsetHeight) height = e.offsetHeight;
   })
   if (parent) { parent.style.setProperty('--offset', height + 'px') }
}
if (CONNECTION_SCHEME_LIST.length > 0) {
   addHeightConnectionScheme(CONNECTION_SCHEME_LIST);
}
// подмена на выбранный контент
// js-data-target - область клика
// js-data-get - источник данных
// js-data-scope - оболочка внутри которой работает логика
// js-data-replace - сюда записывается выбранное
document.addEventListener('click', (event) => {
   if (event.target.closest('.js-data-target')) {
      const dataTarget = event.target.closest('.js-data-target');
      const dataScope = dataTarget.closest('.js-data-scope');
      if (!dataScope) return;
      const dataGet = dataTarget.classList.contains('js-data-get') ?
         dataTarget :
         dataTarget.querySelector('.js-data-get');
      if (!dataGet) return;
      const dataReplace = dataScope.querySelector('.js-data-replace');
      if (!dataReplace) return;
      const dataContent = dataGet.innerHTML.trim();
      if (!dataContent) return;
      dataReplace.innerHTML = dataContent;
   }
})


// двойной ползунок
// .js-double-range-spin.hover стили ползунка при движении
// min="1" max="126" - диапазон
// value="5" какое начальное значение (по умолчанию min, max)
// data-after_decimal="2" - количество цифр после запятой
class InputDoubleRangeMetods {
   constructor() {
      this.startEvent = (event) => {
         isPC ?
            this.mouseX = event.clientX :
            this.mouseX = event.changedTouches[0].clientX;
         this.getProperties();
         isPC ?
            document.addEventListener('mousemove', this.mouseMove) :
            document.addEventListener('touchmove', this.mouseMove);
         if (event.target.closest('.js-double-range-spin-max')) {
            this.spinMove = true;
            this.spin_max.style.zIndex = 2;
            this.spin_min.style.zIndex = 1;
            this.spin_max.classList.add('hover');
            this.moveRange(this.spin_max, this.input_max)
         }
         if (event.target.closest('.js-double-range-spin-min')) {
            this.spinMove = true;
            this.spin_min.style.zIndex = 2;
            this.spin_max.style.zIndex = 1;
            this.spin_min.classList.add('hover');
            this.moveRange(this.spin_min, this.input_min)
         }
      };
      this.andEvent = () => {
         this.spinMove = false;
         const hover = document.querySelector('.js-double-range-spin.hover');
         if (hover) hover.classList.remove('hover');
         isPC ?
            document.removeEventListener('mousemove', this.mouseMove) :
            document.removeEventListener('touchmove ', this.mouseMove)
      };
      this.mouseMove = this.throttle((event) => {
         isPC ? this.mouseX = event.clientX : this.mouseX = event.changedTouches[0].clientX;
      }, 17);
   }
   throttle(callee, timeout) {
      let timer = null;
      return function perform(...args) {
         if (timer) return;
         timer = setTimeout(() => {
            callee(...args);
            clearTimeout(timer);
            timer = null;
         }, timeout)
      }
   }
   setGradient() {
      this.track_range.style.setProperty('--minGradient', ((this.input_min.value - this.min_value) / this.maxRange * 100).toFixed(1) + '%');
      this.track_range.style.setProperty('--maxGradient', ((this.input_max.value - this.min_value) / this.maxRange * 100).toFixed(1) + '%');
   }
   validationInput(input) {
      const val = input.value;
      if (val < this.min_value) input.value = this.min_value;
      if (val > this.max_value) input.value = this.max_value;
      if (this.input_max == input && Number(this.input_max.value) < Number(this.input_min.value)) { input.value = this.input_min.value };
      if (this.input_min == input && Number(this.input_min.value) > Number(this.input_max.value)) { input.value = this.input_max.value };
   }
   setRange(imput, spin) {
      let offsetSpin = (imput.value - this.min_value) / this.maxRange;
      spin.style.left = offsetSpin * this.rangeWidth + 'px';
      this.setGradient();
   }
   moveRange(spin, input) {
      if (!this.spinMove) return;
      let offsetLeft = this.mouseX - this.rangeStart - this.spinWidth / 2;
      if (offsetLeft < 0) { offsetLeft = 0 };
      if (offsetLeft > this.rangeWidth) { offsetLeft = this.rangeWidth };
      let value = Number((this.min_value + offsetLeft / this.rangeWidth * this.maxRange).toFixed(this.afterDecimal));
      if (this.input_max == input && value < Number(this.input_min.value)) { value = this.input_min.value };
      if (this.input_min == input && value > Number(this.input_max.value)) { value = this.input_max.value };
      input.value = value;
      this.setRange(input, spin);
      requestAnimationFrame(() => this.moveRange(spin, input))
   }
   getProperties() {
      this.spinWidth = this.spin_max.offsetWidth;
      this.rangeStart = this.track_range.getBoundingClientRect().left;
      this.rangeWidth = this.track_range.offsetWidth - this.spinWidth;
      this.maxRange = this.max_value - this.min_value;
      this.setRange(this.input_max, this.spin_max);
      this.setRange(this.input_min, this.spin_min);
   }
   addEvents() {
      isPC && this.spin_max.addEventListener('mousedown', this.startEvent);
      isPC && this.spin_min.addEventListener('mousedown', this.startEvent);
      isPC && document.addEventListener('mouseup', this.andEvent);
      !isPC && document.addEventListener('touchend', this.andEvent);
      !isPC && this.spin_max.addEventListener('touchstart', this.startEvent);
      !isPC && this.spin_min.addEventListener('touchstart', this.startEvent);
   }
}

class InputDoubleRange extends InputDoubleRangeMetods {
   constructor(trackRange) {
      super();
      this.input_max = trackRange.querySelector('.js-double-range-input-max');
      this.input_min = trackRange.querySelector('.js-double-range-input-min');
      this.spin_max = trackRange.querySelector('.js-double-range-spin-max');
      this.spin_min = trackRange.querySelector('.js-double-range-spin-min');
      this.track_range = trackRange.querySelector('.js-double-range-track');
      this.max_value = Number(this.input_max.max);
      this.min_value = Number(this.input_min.min);
      this.mouseX;
      this.afterDecimal = this.input_min.dataset.after_decimal || 0
      this.spinMove = false;
      this.spinWidth = this.spin_max.offsetWidth;
      this.rangeStart = this.track_range.getBoundingClientRect().left;
      this.rangeWidth = this.track_range.offsetWidth - this.spinWidth;
      this.maxRange = this.max_value - this.min_value;
      this.input_max.value = this.input_max.value && this.input_max.value <= this.input_max.max ? this.input_max.value : this.input_max.max;
      this.input_min.value = this.input_min.value && this.input_min.value >= this.input_min.min ? this.input_min.value : this.input_min.min;
      this.spin_max.ondragstart = function () { return false };
      this.spin_min.ondragstart = function () { return false };
      trackRange.addEventListener('change', (event) => {
         if (event.target === this.input_min) {
            this.validationInput(this.input_min);
            this.setRange(this.input_min, this.spin_min);
         }
         if (event.target === this.input_max) {
            this.validationInput(this.input_max);
            this.setRange(this.input_max, this.spin_max);
         }
      });
      this.setGradient();
      this.addEvents();
      this.getProperties();
   }
}

const LIST_DOUBLE_RANGES_CONSTRUCTORS = [];
const LIST_DOUBLE_RANGES = document.querySelectorAll('.js-double-range');
LIST_DOUBLE_RANGES.forEach((e, index) => {
   LIST_DOUBLE_RANGES_CONSTRUCTORS[index] = new InputDoubleRange(e);
})
window.addEventListener('resize', () => {
   LIST_DOUBLE_RANGES_CONSTRUCTORS.forEach(e => e.getProperties())
})













// map
const mapContainer = document.getElementById('map');
if (mapContainer) {
   const data = {
      coordinates: '37.686374, 55.737314',
   }

   function loadYMapsAPI() {
      return new Promise((resolve, reject) => {
         if (window.ymaps3) {
            resolve();
            // console.log(" API Яндекс Карт загружено");
            return;
         }
      });
   }

   async function initMap() {
      await loadYMapsAPI();
      await ymaps3.ready;
      const { YMap, YMapMarker, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = ymaps3;

      const map = new YMap(
         mapContainer,
         {
            location: {
               center: data.coordinates.split(','),
               zoom: 17,
            }
         }, [
         new YMapDefaultSchemeLayer(),
         new YMapDefaultFeaturesLayer()
      ]
      );

      const markerTemplate = document.getElementById('marker');
      const markerClone = markerTemplate.content.cloneNode(true);
      const marker = new YMapMarker(
         {
            coordinates: data.coordinates.split(','),
         },
         markerClone
      );
      map.addChild(marker);
   }
   initMap();
}
/* открывает, закрывает модальные окна. */
/*
добавить классы
js-modal-hidden - родительский контейнер модального окна который скрывается и показывается, задать стили скрытия
js-modal-visible - задать стили открытия
js-modal-close - кнопка закрытия модального окна находится внутри js-modal-hidde
кнопка открытия, любая:
js-modal-open - кнопка открытия модального окна
data-modal_open="id" - id модального окна
если надо что бы окно закрывалось при клике на пустое место (фон), добавляется атрибут js-modal-stop-close.
js-modal-stop-close - атрибут указывает на поле, при клике на которое не должно происходить закрытие окна, 
т.е. контейнер контента, при этом внешний родительский контейнет помечается атрибутом js-modal-close.
допускается дополнительно кнопка закрытия внутри js-modal-stop-close.
*/
document.addEventListener('click', (event) => {
   if (event.target.closest('.js-modal-open')) { openModal(event) }
   if (event.target.closest('.js-modal-close')) { testModalStopClose(event) }
})
function openModal(event) {
   let id = event.target.closest('.js-modal-open').dataset.modal_open;
   if (typeof id !== "undefined") { initOpenModal(id) };
}
function testModalStopClose(event) {
   if (event.target.closest('.js-modal-stop-close') &&
      event.target.closest('.js-modal-stop-close') !==
      event.target.closest('.js-modal-close').closest('.js-modal-stop-close')) {
      return
   }
   closeModal(event);
}
function closeModal(event) {
   event.target.closest('.js-modal-hidden').classList.remove('js-modal-visible');
   activeScrollCloseModal();
}
// функция закрытия модального окна (передать id модального окна)
function initCloseModal(id) {
   if (document.querySelector(`#${id}`)) {
      document.querySelector(`#${id}`).classList.remove('js-modal-visible');
   }
   activeScrollCloseModal();
}
// функция открытия модального окна (передать id модального окна)
function initOpenModal(id) {
   if (document.querySelector(`#${id}`)) {
      document.querySelector(`#${id}`).classList.add('js-modal-visible');
      document.body.classList.add('body-overflow')
   }
}
function activeScrollCloseModal() {
   if (!document.querySelector('.js-modal-visible')) {
      document.body.classList.remove('body-overflow');
   }
}

const steppers = document.querySelectorAll('.js-stepper');
if (steppers.length > 0) {
   steppers.forEach(stepper => {
      let activeIndex = 0;
      const listInputs = stepper.querySelectorAll('input');
      listInputs.forEach((e, i) => { if (e.checked) { activeIndex = i } });
      stepper.addEventListener('click', (event) => {
         if (event.target.closest('.js-stepper-decrement')) {
            if (activeIndex > 0) {
               --activeIndex;
               listInputs[activeIndex].checked = true;
            }
         }
         if (event.target.closest('.js-stepper-increment')) {
            if (activeIndex < listInputs.length - 1) {
               ++activeIndex;
               listInputs[activeIndex].checked = true;
            }
         }
      })
   })
}
if (document.querySelector('.wide-slider__swiper')) {
   const swiper = new Swiper('.wide-slider__swiper', {
      allowTouchMove: true,
      loop: true,
      spaceBetween: 10,
      speed: 300,
      slidesPerView: 1.2,
      grabCursor: true,
      // initialSlide: 2,
      centeredSlides: true,
      breakpoints: {
         768: {
            slidesPerView: 1.855,
         }
      },
      navigation: {
         nextEl: ".wide-slider__button-next",
         prevEl: ".wide-slider__button-prev",
      },

   });
}

if (document.querySelector('.primary__swiper')) {
   const list = document.querySelectorAll('.primary__swiper');
   list.forEach(e => {
      const swiper = new Swiper(e, {
         spaceBetween: 10,
         speed: 300,
         slidesPerView: 2.1,
         breakpoints: {
            768: {
               slidesPerView: 5
            }
         },
      });
   })
}
if (document.querySelector('.services-swiper__body')) {
   const list = document.querySelectorAll('.services-swiper__body');
   list.forEach(e => {
      const swiper = new Swiper(e, {
         spaceBetween: 10,
         speed: 300,
         slidesPerView: 1.5,
         breakpoints: {
            768: {
               slidesPerView: 2.5
            },
            992: {
               slidesPerView: 3.5
            },
            1200: {
               slidesPerView: 4
            }
         },
      });
   })
}

/* пример инициализации слайдера */
// if (document.querySelector('.swiper')) {
//    const swiper = new Swiper('.swiper', {
//       keyboard: {
//          enabled: true,
//          onlyInViewport: true,
//       },
//       allowTouchMove: false,
//       loop: true,
//       spaceBetween: 10,
//       speed: 300,
//       slidesPerView: 2.5,
//       slidesPerView: 'auto', // количаство слайдеров без авто ширины
//       grabCursor: true,
//       initialSlide: 2,
//       centeredSlides: true,
//       effect: "fade",
//       breakpoints: {
//          1024: {
//             spaceBetween: 20,
//             slidesPerView: 3
//          },
//          768: {
//             slidesPerView: 2
//          }
//       },
//       navigation: {
//          nextEl: ".next",
//          prevEl: ".prev",
//       },
//       pagination: {
//          el: '.pagination__body',
//          type: 'bullets',
//          type: 'fraction',
//          clickable: true,
//       },
//       scrollbar: {
//          el: ".projects__swiper-pagination",
//       },
//       autoplay: {
//          delay: 2000,
//       },
//       virtual: {
//          enabled: true,
//       },
//       freeMode: {
//          enabled: true,
//          momentum: false // Отключаем инерцию для точного позиционирования
//       },
//    });
// }




/* создание и ликвидация состояния слайдера в зависимости от ширины вьюпорта */
// if (document.querySelector('.swiper')) {
//    let swiperState;
//    let swiper;
//    changeStateSlider();
//    window.addEventListener('resize', () => {
//       changeStateSlider();
//    })
//    function initswiper() {
//       swiper = new Swiper('.swiper', {
//          keyboard: {
//             enabled: true,
//             onlyInViewport: true,
//          },
//          allowTouchMove: true,
//          loop: false,
//          speed: 300,
//          slidesPerView: 1.3,
//          spaceBetween: 24,
//       });
//    }
//    function changeStateSlider() {
//       if (!MIN768.matches) {
//          if (!swiperState) {
//             swiperState = true;
//             initswiper();
//          }
//       } else {
//          if (swiperState) {
//             swiperState = false;
//             swiper.destroy(true, true);
//          }
//       }
//    }
// }

// js-tabs-body - тело вкладки, в открытом состоянии добавляется класс js-tabs-open.
// * !!! где js-tabs-body, добавить data-tabs-duration="500" скорость анимации в 'мс', 500мс по умолчанию.
// js-tabs-hover - работает hover на ПК (должен быть с js-tabs-body), отключает клик на ПК, для touchscreen надо раставить js-tabs-click или js-tabs-toggle
// js-tabs-closing - вместе с js-tabs-body закрыть вкладку при событии вне данной вкладки
// js-tabs-click - открыть при клике (зона клика)
// js-tabs-toggle - открыть или закрыть при клике (зона клика)
// js-tabs-group - обвернуть группу табов, что бы был открыт только один из группы,
// js-tabs-group-all - если внутри табов есть дочерние табы сгруппированные js-tabs-group, тогда можно группу родительских табов обвернуть в js-tabs-group-all, тогда при переключении родительского таба будут закрываться все дочерние табы
// js-tabs-shell - оболочка скрывающая js-tabs-inner, присвоить стили  transition: height var(--tabs-duration, 0.5s);
// js-tabs-inner - оболочка контента
//
//
// работает в связке с определением touchscreen  (isPC)


class Tabs {
   constructor() {
      this.listClosingTabs = document.querySelectorAll('.js-tabs-closing');
      this.listHover = document.querySelectorAll('.js-tabs-hover');
      this.listTabsBody = document.querySelectorAll('.js-tabs-body');
      this.pause = false;
   };
   init = () => {
      const listDuration = document.querySelectorAll('[data-tabs_duration]');
      listDuration.forEach((e) => e.style.setProperty('--tabs-duration', e.dataset.tabs_duration / 1000 + 's'))
      document.body.addEventListener('click', this.eventClick);
      if (isPC && this.listHover.length > 0) document.body.addEventListener('mouseover', this.eventMouseOver)
   };
   eventClick = (event) => {
      if (event.target.tagName.toLowerCase() == 'input') return;
      if (isPC && event.target.closest('.js-tabs-hover')) return;
      this.closeAll(event);
      if (event.target.closest('.js-tabs-click')) {
         this.eventClickGroup(event);
         this.openTab(event.target.closest('.js-tabs-click'))
         return;
      }
      if (event.target.closest('.js-tabs-toggle')) {
         this.eventClickGroup(event);
         this.toggleTabs(event.target.closest('.js-tabs-toggle'));
         return;
      };
   };
   eventClickGroup = (event) => {
      if (event.target.closest('.js-tabs-group')) { this.closeGroup(event) }
      if (event.target.closest('.js-tabs-group-all') && !event.target.closest('.js-tabs-group')) { this.closeGroupAll(event) }
   }
   querySelectExcluding = (groupItem) => {
      const allElements = groupItem.querySelectorAll('.js-tabs-body');
      const excludeElements = groupItem.querySelectorAll('.js-tabs-group');
      return Array.from(allElements).filter(element => {
         return !Array.from(excludeElements).some(excludeEl =>
            excludeEl !== element && excludeEl.contains(element)
         );
      });
   }
   eventMouseOver = (event) => {
      if (event.target.closest('.js-tabs-hover')) {
         if (event.target.closest('.js-tabs-hover').classList.contains('js-tabs-open')) return;
         this.openTab(event.target);
      };
      this.closeAllHover(event.target);
   };

   // не закрывает табы дочерних js-tabs-group
   closeGroup = (event) => {
      const groupFilter = this.querySelectExcluding(event.target.closest('.js-tabs-group'))
      groupFilter.forEach((e) => {
         if (event.target.closest('.js-tabs-toggle') && event.target.closest('.js-tabs-toggle') == (e.querySelector('.js-tabs-toggle') || e.closest('.js-tabs-toggle'))) return;
         if (event.target.closest('.js-tabs-click') && event.target.closest('.js-tabs-click') == (e.querySelector('.js-tabs-click') || e.closest('.js-tabs-click'))) return;
         this.closeTab(e)
      })
   }
   // закрывает все табы внутри js-tabs-group-all
   closeGroupAll = (event) => {
      const group = event.target.closest('.js-tabs-group-all').querySelectorAll('.js-tabs-body');
      group.forEach((e) => {
         if (event.target.closest('.js-tabs-toggle') && event.target.closest('.js-tabs-toggle') == (e.querySelector('.js-tabs-toggle') || e.closest('.js-tabs-toggle'))) return;
         if (event.target.closest('.js-tabs-click') && event.target.closest('.js-tabs-click') == (e.querySelector('.js-tabs-click') || e.closest('.js-tabs-click'))) return;
         this.closeTab(e)
      })
   }
   openTab = (element) => {
      const body = element.closest('.js-tabs-body');
      if (!body || body.classList.contains('js-tabs-open')) return;
      body.classList.add('js-tabs-open');
      if (!body.querySelector('.js-tabs-shell')) return;
      this.setHeight(body);
   };
   closeTab = (body) => {
      body.classList.remove('js-tabs-open');
      if (!body.querySelector('.js-tabs-shell')) return;
      this.clearHeight(body);
   };
   closeAll = (event) => {
      const body = event.target.closest('.js-tabs-body');
      if (this.listClosingTabs.length == 0 && body) return;
      this.listClosingTabs.forEach((e) => { if (e !== body) this.closeTab(e); })
   };
   closeAllHover = (target) => {
      const element = target.closest('.js-tabs-hover');
      this.listHover.forEach((e) => { if (element !== e) this.closeTab(e) })
   };
   setHeight = (body) => {
      const duration = body.dataset.tabs_duration;
      this.addHeight(body);
      setTimeout(() => {
         if (body.querySelector('.js-tabs-shell').style.height == '') return;
         body.querySelector('.js-tabs-shell').style.height = 'auto'
      }, duration || 500)
   };
   clearHeight = (body) => {
      this.addHeight(body);
      requestAnimationFrame(() => { body.querySelector('.js-tabs-shell').style.height = "" })
   }
   addHeight = (body) => {
      const inner = body.querySelector('.js-tabs-inner');
      if (!inner) return;
      body.querySelector('.js-tabs-shell').style.height = inner.offsetHeight + 1 + "px";
   }
   toggleTabs = (element) => {
      const body = element.closest('.js-tabs-body');
      if (body.classList.contains('js-tabs-open')) {
         this.closeTab(body);
         return;
      }
      this.openTab(element);
   };
}
const tabs = new Tabs().init();







class TabsSwitching {
   constructor(button_name, tab_name, execute) {
      this.name_button = button_name;
      this.list_buttons = document.querySelectorAll(button_name);
      this.list_tabs = document.querySelectorAll(tab_name);
      this.execute = execute;
   }
   init = () => {
      document.body.addEventListener('click', (event) => {
         if (event.target.closest(this.name_button)) {
            actionTabsSwitching(event, event.target.closest(this.name_button), this.list_buttons, this.list_tabs, this.execute)
         }
      })
   }
}

function actionTabsSwitching(event, target_button, list_buttons, list_tabs, execute) {
   let number = target_button.dataset.button_ts;
   if (!number) return;
   list_buttons.forEach((e) => { e.classList.toggle('active', e.dataset.button_ts == number) });
   if (list_tabs.length > 0) { list_tabs.forEach((e) => { e.classList.toggle('active', e.dataset.tab_ts == number) }) }
   if (execute) { this.execute(event) };
}

function addTabsSwitching(button_name, tab_name, fn_name) {
   if (document.querySelector(button_name) && document.querySelector(tab_name)) {
      let tab = new TabsSwitching(button_name, tab_name, fn_name);
      tab.init();
   }
}

// addTabsSwitching('.button_name', '.tab_name', '.fn_name')
addTabsSwitching('.js-server-configuration-tab-button', '.js-server-configuration-tab')
addTabsSwitching('.js-server-placement-tab-button', '.js-server-placement-tab')


