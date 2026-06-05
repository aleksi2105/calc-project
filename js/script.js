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
  init: function () {
    this.addTitle()
    handlerBtn.addEventListener('click', this.start.bind(this))
    addBtn.addEventListener('click', this.addScreenBlock.bind(this))


    if (inputRange) {
      inputRange.addEventListener('input', this.updateRollbackValue.bind(this))
    }
  },
  addTitle: function () {
    document.title = projectTitle.textContent
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
  },

  updateRollbackValue: function (event) {
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
    const cloneScreen = screenType[0].cloneNode(true)
    screenType[screenType.length - 1].after(cloneScreen)
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