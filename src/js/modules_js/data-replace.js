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

