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
  rollBack: 25,
  fullPrice: 0,
  servicePercentPrice: 0,
  allServicePrices: 0,
  services: {},
  init: function () {
    appData.addTitle()
    handlerBtn.addEventListener('click', appData.start)
    addBtn.addEventListener('click', appData.addScreenBlock)
  },
  addTitle: function () {
    document.title = projectTitle.textContent
  },

  start: function () {
    appData.addScreens()
    // appData.asking();
    // appData.addPrices();
    // appData.getFullPrice();
    // appData.getServicePercentPrices();
    // appData.getTitle();
    // appData.logger();
  },
  addScreens: function () {
    screenType.forEach(function (screen, index) {
      const select = screen.querySelector('select')
      const input = screen.querySelector('input')
      const selectName = select.options[select.selectedIndex].textContent

      appData.screens.push({
        id: index,
        name: selectName,
        price: +select.value * +input.value
      });
    })
  },
  addScreenBlock: function () {
    const cloneScreen = screenType[0].cloneNode(true)
    screenType[screenType.length - 1].after(cloneScreen)
  },

  asking: function () {


    for (let i = 0; i < 2; i++) {
      let name = appData.getTextAnswer("Какой дополнительный тип услуги нужен?");
      let servicePrice = appData.getNumberAnswer("Сколько это будет стоить?");

      appData.services[name] = servicePrice;
    }

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
    for (let screen of appData.screens) {
      appData.screenPrice += +screen.price;
    }

    for (let key in appData.services) {
      appData.allServicePrices += +appData.services[key];
    }
  },

  getTitle: function () {
    const str = appData.title.trim();
    if (!str) return "";
    appData.title = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  getFullPrice: function () {
    appData.fullPrice = +appData.screenPrice + appData.allServicePrices;
  },

  getServicePercentPrices: function () {
    appData.servicePercentPrice = appData.fullPrice - (appData.fullPrice * (appData.rollBack / 100));
  },

  getRollbackMessage: function (price) {
    if (price >= 30000) {
      return "Даем скидку в 10%";
    } else if (price >= 15000 && price < 30000) {
      return "Даем скидку в 5%";
    } else if (price >= 0 && price < 15000) {
      return "Скидка не предусмотрена";
    } else {
      return "Что то пошло не так";
    }
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