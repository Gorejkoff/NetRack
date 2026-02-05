document.addEventListener('click', (event) => {
   const dec = event.target.closest('.js-form-dicrement');
   const inc = event.target.closest('.js-form-increment');
   if (dec) {
      const input = dec.closest('.js-form-count')?.querySelector('.js-form-value');
      if (!input) return;
      console.log('CLICK -');
      console.log('old value:', input.value);
      //  input.value = Number(input.value) - 1;
      console.log('new value before validation:', input.value);
      validationQuantityForm(input);
      console.log('value after validation:', input.value);
   }
   if (inc) {
      const wrap = inc.closest('.js-form-count');
      const input = wrap?.querySelector('.js-form-value');
      if (!input) return;
      //  input.value = Number(input.value) + 1;
      validationQuantityForm(input);
   }
});

document.addEventListener('change', (event) => {
   const input = event.target.closest('.js-form-value');
   if (!input) return;
   console.log('CHANGE event fired');
   console.log('value on change:', input.value);
   validationQuantityForm(input);
   console.log('value after change validation:', input.value);
});

function validationQuantityForm(e) {
   console.log('VALIDATION start:', e.value);
   const max = Number(e.max);
   const min = Number(e.min);
   if (max && Number(e.value) > max) {
      console.log('hit MAX limit');
      e.value = max;
   }
   if (min && Number(e.value) < min) {
      console.log('hit MIN limit');
      e.value = min;
   }
   console.log('VALIDATION end:', e.value);
}
