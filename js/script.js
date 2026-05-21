'use strict';

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

  start: function () {
    appData.asking();
    appData.addPrices();
    appData.getFullPrice();
    appData.getServicePercentPrices();
    appData.getTitle();
    appData.logger();
  },

  asking: function () {
    appData.title = appData.getTextAnswer("Как называется ваш проект?", "Калькулятор верстки");

    for (let i = 0; i < 2; i++) {
      let name = appData.getTextAnswer("Какие типы экранов нужно разработать?");
      let price = appData.getNumberAnswer("Сколько будет стоить данная работа?");

      appData.screens.push({ id: i, name: name, price: price });
    }

    for (let i = 0; i < 2; i++) {
      let name = appData.getTextAnswer("Какой дополнительный тип услуги нужен?");
      let servicePrice = appData.getNumberAnswer("Сколько это будет стоить?");

      appData.services[name] = servicePrice;
    }

    appData.adaptive = confirm("Нужен ли адаптив на сайте?");
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

  isNumber: function (num) {
    return /^\d+$/.test(num);
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

appData.start();