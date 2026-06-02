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
    appData.addTitle()
    handlerBtn.addEventListener('click', appData.start)
    addBtn.addEventListener('click', appData.addScreenBlock)


    if (inputRange) {
      inputRange.addEventListener('input', appData.updateRollbackValue)
    }
  },
  addTitle: function () {
    document.title = projectTitle.textContent
  },

  start: function () {

    if (!appData.validateScreens()) {
      alert('Пожалуйста, заполните все блоки с экранами: выберите тип и укажите количество.');
      return;
    }

    appData.addScreens()
    appData.addServices()
    appData.addPrices();
    // appData.logger();
    appData.showResult()
  },

  updateRollbackValue: function (event) {
    const value = event.target.value;

    if (rangeValue) {
      rangeValue.textContent = value + '%';
    }

    appData.rollBack = +value;
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
    totalInputs.value = appData.screenPrice
    totalCount.value = appData.totalScreensCount
    totalCountOther.value = appData.servicePricesPercent + appData.servicePricesNumber
    fullTotalCount.value = appData.fullPrice
    totalCountRollback.value = appData.servicePercentPrice
  },

  addScreens: function () {
    let screenType = document.querySelectorAll('.screen');

    screenType.forEach(function (screen, index) {
      const select = screen.querySelector('select')
      const input = screen.querySelector('input')
      const selectName = select.options[select.selectedIndex].textContent

      appData.screens.push({
        id: index,
        name: selectName,
        price: +select.value * +input.value,
        count: +input.value
      });
    })

    console.log(appData.screens);

  },
  addServices: function () {
    percentItems.forEach(function (item) {
      const check = item.querySelector('input[type=checkbox]')
      const label = item.querySelector('label')
      const input = item.querySelector('input[type=text]')

      if (check.checked) {
        appData.servicesPercent[label.textContent] = +input.value
      }

    })

    numberItems.forEach(function (item) {
      const check = item.querySelector('input[type=checkbox]')
      const label = item.querySelector('label')
      const input = item.querySelector('input[type=text]')

      if (check.checked) {
        appData.servicesNumber[label.textContent] = +input.value
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
    } while (!appData.isText(answer));

    return answer;
  },

  getNumberAnswer: function (question) {
    let answer;

    do {
      answer = prompt(question);
      if (answer === null) return 0;
      answer = answer.trim();
    } while (!appData.isNumber(answer));

    return +answer;
  },

  isText: function (str) {
    if (!str) return false;
    return isNaN(+str) || /\D/.test(str);
  },



  addPrices: function () {
    appData.screenPrice = 0;
    appData.servicePricesNumber = 0;
    appData.servicePricesPercent = 0;
    appData.totalScreensCount = 0;

    for (let screen of appData.screens) {
      appData.screenPrice += +screen.price;
      appData.totalScreensCount += screen.count;
    }

    for (let key in appData.servicesNumber) {
      appData.servicePricesNumber += appData.servicesNumber[key];
    }

    for (let key in appData.servicesPercent) {
      appData.servicePricesPercent += appData.screenPrice * (appData.servicesPercent[key] / 100)
    }

    appData.fullPrice = +appData.screenPrice + appData.servicePricesPercent + appData.servicePricesNumber;

    appData.servicePercentPrice = appData.fullPrice - (appData.fullPrice * (appData.rollBack / 100));
  },

  logger: function () {
    console.log('title', appData.title);
    console.log('screens', appData.screens);
    console.log('screenPrice', appData.screenPrice);
    console.log('services', appData.services);
    console.log('allServicePrices', appData.allServicePrices);
    console.log('fullPrice', appData.fullPrice);
    console.log('servicePercentPrice', appData.servicePercentPrice);
    console.log('adaptive', appData.adaptive);
  },
};

appData.init();