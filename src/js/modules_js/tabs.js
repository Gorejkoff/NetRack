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




