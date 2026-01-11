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
