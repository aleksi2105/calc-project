'use strict';

const projectTitle = document.getElementsByTagName('h1')[0];

const handlerBtn = document.getElementsByClassName('handler_btn')[0];
const resetBtn = document.getElementsByClassName('handler_btn')[1];
const addBtn = document.querySelector('.screen-btn');

const percentItems = document.querySelectorAll('.other-items.percent');
const numberItems = document.querySelectorAll('.other-items.number');

const inputRange = document.querySelector('.rollback input[type="range"]');
const rangeValue = document.querySelector('.rollback .range-value');

const totalInputs = document.getElementsByClassName('total-input')[0];
const totalCount = document.getElementsByClassName('total-input')[1];
const totalCountOther = document.getElementsByClassName('total-input')[2];
const fullTotalCount = document.getElementsByClassName('total-input')[3];
const totalCountRollback = document.getElementsByClassName('total-input')[4];

const elementsArray = [];
for (let i = 0; i < totalInputs.length; i++) {
  elementsArray.push(totalInputs[i]);
};
let screenType = document.querySelectorAll('.screen');

const appData = {
  title: '',
  screens: [],
  screenPrice: 0,
  adaptive: true,
  rollBack: 0,
  fullPrice: 0,
  servicePercentPrice: 0,
  servicePricesNumber: 0,
  servicePricesPercent: 0,
  servicesPercent: {},
  servicesNumber: {},
  totalScreensCount: 0,
  originalPlaceholders: {},
  init: function () {
    this.addTitle()
    this.saveOriginalPlaceholders()
    handlerBtn.addEventListener('click', this.start.bind(this))
    resetBtn.addEventListener('click', this.reset.bind(this))
    addBtn.addEventListener('click', this.addScreenBlock.bind(this))


    resetBtn.style.display = 'none'


    if (inputRange) {
      inputRange.addEventListener('input', this.updateRollbackValue.bind(this))
    }
  },
  addTitle: function () {
    document.title = projectTitle.textContent
  },

  saveOriginalPlaceholders: function () {
    this.originalPlaceholders = {};
    const screenInputs = document.querySelectorAll('.screen input[type="text"]');
    screenInputs.forEach((input, index) => {
      const key = `screen_input_${index}`;
      // Сохраняем value, а не placeholder
      this.originalPlaceholders[key] = input.value;
    });

    percentItems.forEach((item, index) => {
      const input = item.querySelector('input[type="text"]');
      if (input) {
        const key = `percent_input_${index}`;
        this.originalPlaceholders[key] = input.value;
      }
    });

    numberItems.forEach((item, index) => {
      const input = item.querySelector('input[type="text"]');
      if (input) {
        const key = `number_input_${index}`;
        this.originalPlaceholders[key] = input.value;
      }
    });
  },

  restoreOriginalPlaceholders: function () {
    const screenInputs = document.querySelectorAll('.screen input[type="text"]');
    screenInputs.forEach((input, index) => {
      const key = `screen_input_${index}`;
      if (this.originalPlaceholders[key] !== undefined) {
        input.value = this.originalPlaceholders[key];
      }
    });

    percentItems.forEach((item, index) => {
      const input = item.querySelector('input[type="text"]');
      if (input) {
        const key = `percent_input_${index}`;
        if (this.originalPlaceholders[key] !== undefined) {
          input.value = this.originalPlaceholders[key];
        }
      }
    });

    numberItems.forEach((item, index) => {
      const input = item.querySelector('input[type="text"]');
      if (input) {
        const key = `number_input_${index}`;
        if (this.originalPlaceholders[key] !== undefined) {
          input.value = this.originalPlaceholders[key];
        }
      }
    });
  },

  start: function () {

    if (!this.validateScreens()) {
      alert('Пожалуйста, заполните все блоки с экранами: выберите тип и укажите количество.');
      return;
    }

    this.addScreens()
    this.addServices()
    this.addPrices();
    // this.logger();
    this.showResult()
    this.disableInputs()
    this.switchButtons()
  },

  reset: function () {
    this.screens = [];
    this.screenPrice = 0;
    this.rollBack = 0;
    this.fullPrice = 0;
    this.servicePercentPrice = 0;
    this.servicePricesNumber = 0;
    this.servicePricesPercent = 0;
    this.servicesPercent = {};
    this.servicesNumber = {};
    this.totalScreensCount = 0;

    if (totalInputs) totalInputs.value = '';
    if (totalCount) totalCount.value = '';
    if (totalCountOther) totalCountOther.value = '';
    if (fullTotalCount) fullTotalCount.value = '';
    if (totalCountRollback) totalCountRollback.value = '';

    const screens = document.querySelectorAll('.screen');
    for (let i = screens.length - 1; i > 0; i--) {
      screens[i].remove();
    }

    const firstScreen = document.querySelector('.screen');
    if (firstScreen) {
      const firstSelect = firstScreen.querySelector('select');
      const firstInput = firstScreen.querySelector('input[type="text"]');
      if (firstSelect) firstSelect.value = '';
      if (firstInput) {
        firstInput.value = '';
      }
    }


    percentItems.forEach((item, index) => {
      const check = item.querySelector('input[type=checkbox]');
      const input = item.querySelector('input[type=text]');
      if (check) check.checked = false;
      if (input) {
        input.value = '';
      }
    });

    numberItems.forEach((item, index) => {
      const check = item.querySelector('input[type=checkbox]');
      const input = item.querySelector('input[type=text]');
      if (check) check.checked = false;
      if (input) {
        input.value = '';
      }
    });

    if (inputRange) {
      inputRange.value = '0';
      if (rangeValue) {
        rangeValue.textContent = '0%';
      }
    }
    this.enableInputs();
    this.restoreOriginalPlaceholders();
    this.switchButtons();
  },

  disableInputs: function () {

    const allSelects = document.querySelectorAll('.screen select');
    allSelects.forEach(select => {
      select.disabled = true;
    });

    const allTextInputs = document.querySelectorAll('.screen input[type="text"]');
    allTextInputs.forEach(input => {
      input.disabled = true;
    });

    const allServiceChecks = document.querySelectorAll('.other-items input[type="checkbox"]');
    allServiceChecks.forEach(checkbox => {
      checkbox.disabled = true;
    });

    const allServiceInputs = document.querySelectorAll('.other-items input[type="text"]');
    allServiceInputs.forEach(input => {
      input.disabled = true;
    });

    if (inputRange) {
      inputRange.disabled = true;
    }

    if (addBtn) {
      addBtn.disabled = true;
    }
  },

  enableInputs: function () {

    const allSelects = document.querySelectorAll('.screen select');
    allSelects.forEach(select => {
      select.disabled = false;
    });


    const allTextInputs = document.querySelectorAll('.screen input[type="text"]');
    allTextInputs.forEach(input => {
      input.disabled = false;
    });

    const allServiceChecks = document.querySelectorAll('.other-items input[type="checkbox"]');
    allServiceChecks.forEach(checkbox => {
      checkbox.disabled = false;
    });

    const allServiceInputs = document.querySelectorAll('.other-items input[type="text"]');
    allServiceInputs.forEach(input => {
      input.disabled = false;
    });

    if (inputRange) {
      inputRange.disabled = false;
    }

    if (addBtn) {
      addBtn.disabled = false;
    }
  },

  switchButtons: function () {
    if (handlerBtn.style.display === 'none') {
      handlerBtn.style.display = '';
      resetBtn.style.display = 'none';
    } else {
      handlerBtn.style.display = 'none';
      resetBtn.style.display = '';
    }
  },


  updateRollbackValue: function (event) {
    if (inputRange && inputRange.disabled) return;
    const value = event.target.value;

    if (rangeValue) {
      rangeValue.textContent = value + '%';
    }

    this.rollBack = +value;
  },

  validateScreens: function () {
    const currentScreens = document.querySelectorAll('.screen');

    for (let screen of currentScreens) {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input[type="text"]');

      const isSelectValid = select && select.value !== '';
      const isInputValid = input && input.value.trim() !== '' && !isNaN(+input.value.trim()) && +input.value.trim() > 0;

      if (!isSelectValid || !isInputValid) {
        return false;
      }
    }

    return currentScreens.length > 0;
  },

  showResult: function () {
    totalInputs.value = this.screenPrice
    totalCount.value = this.totalScreensCount
    totalCountOther.value = this.servicePricesPercent + this.servicePricesNumber
    fullTotalCount.value = this.fullPrice
    totalCountRollback.value = this.servicePercentPrice
  },

  addScreens: function () {
    let screenType = document.querySelectorAll('.screen');

    screenType.forEach((screen, index) => {
      const select = screen.querySelector('select')
      const input = screen.querySelector('input')
      const selectName = select.options[select.selectedIndex].textContent

      this.screens.push({
        id: index,
        name: selectName,
        price: +select.value * +input.value,
        count: +input.value
      });
    })

    console.log(this.screens);

  },
  addServices: function () {
    percentItems.forEach((item) => {
      const check = item.querySelector('input[type=checkbox]')
      const label = item.querySelector('label')
      const input = item.querySelector('input[type=text]')

      if (check.checked) {
        this.servicesPercent[label.textContent] = +input.value
      }

    })

    numberItems.forEach((item) => {
      const check = item.querySelector('input[type=checkbox]')
      const label = item.querySelector('label')
      const input = item.querySelector('input[type=text]')

      if (check.checked) {
        this.servicesNumber[label.textContent] = +input.value
      }
    })
  },



  addScreenBlock: function () {
    if (addBtn && addBtn.disabled) return;

    const cloneScreen = screenType[0].cloneNode(true)
    const cloneSelect = cloneScreen.querySelector('select');
    const cloneInput = cloneScreen.querySelector('input[type="text"]');
    if (cloneSelect) cloneSelect.value = '';
    if (cloneInput) {
      cloneInput.value = '';
      const newIndex = document.querySelectorAll('.screen').length;
      const key = `screen_input_${newIndex}`;
      if (this.originalPlaceholders) {
        this.originalPlaceholders[key] = cloneInput.placeholder;
      }
    }

    screenType[screenType.length - 1].after(cloneScreen)
    screenType = document.querySelectorAll('.screen');
  },



  getTextAnswer: function (question, defaultValue = '') {
    let answer;

    do {
      answer = prompt(question, defaultValue);
      if (answer === null) return '';
      answer = answer.trim();
    } while (!this.isText(answer));

    return answer;
  },

  getNumberAnswer: function (question) {
    let answer;

    do {
      answer = prompt(question);
      if (answer === null) return 0;
      answer = answer.trim();
    } while (!this.isNumber(answer));

    return +answer;
  },

  isText: function (str) {
    if (!str) return false;
    return isNaN(+str) || /\D/.test(str);
  },

  addPrices: function () {
    this.screenPrice = 0;
    this.servicePricesNumber = 0;
    this.servicePricesPercent = 0;
    this.totalScreensCount = 0;

    for (let screen of this.screens) {
      this.screenPrice += +screen.price;
      this.totalScreensCount += screen.count;
    }

    for (let key in this.servicesNumber) {
      this.servicePricesNumber += this.servicesNumber[key];
    }

    for (let key in this.servicesPercent) {
      this.servicePricesPercent += this.screenPrice * (this.servicesPercent[key] / 100)
    }

    this.fullPrice = +this.screenPrice + this.servicePricesPercent + this.servicePricesNumber;

    this.servicePercentPrice = this.fullPrice - (this.fullPrice * (this.rollBack / 100));
  },

  logger: function () {
    console.log('title', this.title);
    console.log('screens', this.screens);
    console.log('screenPrice', this.screenPrice);
    console.log('services', this.services);
    console.log('allServicePrices', this.allServicePrices);
    console.log('fullPrice', this.fullPrice);
    console.log('servicePercentPrice', this.servicePercentPrice);
    console.log('adaptive', this.adaptive);
  },
};

appData.init();