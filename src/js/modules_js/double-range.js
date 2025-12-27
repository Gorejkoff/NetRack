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












