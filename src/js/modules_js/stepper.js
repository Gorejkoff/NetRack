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