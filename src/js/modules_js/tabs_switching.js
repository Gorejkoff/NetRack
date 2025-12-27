

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


