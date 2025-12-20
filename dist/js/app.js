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
})


// ** ======================= CLICK ======================  ** //
document.documentElement.addEventListener("click", (event) => {
   if (event.target.closest('.open-menu')) { openHeaderMenu() }
})

function openHeaderMenu() {
   document.body.classList.toggle('menu-is-open')
}
function closeHeaderMenu() {
   document.body.classList.remove('menu-is-open')
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
      console.log(dataGet);
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
         isPC ? this.mouseX = event.clientX : this.mouseX = event.changedTouches[0].clientX;
         this.getProperties();
         document.addEventListener('mousemove', this.mouseMove);
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
         document.removeEventListener('mousemove', this.mouseMove)
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
addTabsSwitching('.server-configuration__tab-button', '.server-configuration__tab')


