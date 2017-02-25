var getWeatherFromAPI = require("./../services/getDataFromAPI"),
    statisticsService = require("./../services/StatisticService"),
    set = require("./../config/settings.json"),
    cron = require("node-cron");

module.exports = (function () {
    "use strict";
    var date = new Date(),
        dayTask = cron.schedule(set.cronTask.everyDay, function () {
            statisticsService.serviceDayStatistics(date);
            statisticsService.cityDayStatistics(date);
            statisticsService.serviceDayStatisticByCity(date);
        }, false),
        monthTask = cron.schedule(set.cronTask.everyMonth, function () {
            statisticsService.serviceMonthStatistics(date);
            statisticsService.cityMonthStatistics(date);
            statisticsService.serviceMonthStatisticByCity(date);
        }, false),
        everyFourHourTask = cron.schedule(set.cronTask.everyFourHours, function () {
            getWeatherFromAPI.getWeatherData();
        }, false),
        initialize = function () {
            dayTask.start();
            monthTask.start();
            everyFourHourTask.start();


            /**
             * template for gather statistic from unifiedWeather collection
             */

            // for (var d = new Date(2017, 0, 1); d <= date; d.setDate(d.getDate() + 1)) {
            //     statisticsService.serviceDayStatisticByCity(new Date(d));
            // }

        };

    return {
        initialize: initialize
    };
}());