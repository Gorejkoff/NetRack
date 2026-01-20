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