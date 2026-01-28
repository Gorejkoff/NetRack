if (document.querySelector('.js-form-count')) {
   document.body.addEventListener('click', (event) => {
      if (event.target.closest('.js-form-dicrement')) {
         const input = event.target.closest('.js-form-count').querySelector('.js-form-value');
         input.value = Number(input.value) - 1;
         validationQuantityForm(input);
      }
      if (event.target.closest('.js-form-increment')) {
         const input = event.target.closest('.js-form-count').querySelector('.js-form-value');
         input.value = Number(input.value) + 1;
         validationQuantityForm(input);
      }
   })

   // проверка количесва товара в корзине
   const QUANTITY_FORM = document.querySelectorAll('.js-form-value');
   QUANTITY_FORM.forEach((e) => {
      e.addEventListener('change', () => validationQuantityForm(e));
   })
   function validationQuantityForm(e) {
      if (Number(e.max) && Number(e.max) < Number(e.value)) {
         e.value = Number(e.max);
         return;
      }
      if (Number(e.min) && Number(e.min) > Number(e.value)) {
         e.value = Number(e.min);
         return;
      }
   }
}