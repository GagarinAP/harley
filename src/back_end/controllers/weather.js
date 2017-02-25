var logger = require("./../services/logger.js"),
    dataBaseService = require("./../services/DataBaseService"),
    pathToDBs = require("./../config/pathConfig.json"),
    set = require("./../config/settings.json"),
    config = require("./../services/ConfigService.js"),
    fs = require("fs"),
    _ = require("lodash");
module.exports = (function () {
    "use strict";
    var readData = function (path) {
            try {
                var result = fs.readFileSync(path, "utf8");
                return JSON.parse(result);
            } catch (e) {
                logger.logError(set.messages.fs.cantReadFile + path);
                return [];
            }
        },
        getDate = function (dateFrom, dateTo, needMonth) {
            var start, end;
            if (_.isString(dateTo)) {
                start = new Date(dateFrom);
                end = new Date(dateTo);
            } else {
                start = new Date(dateFrom);
                end = new Date(dateFrom);
            }
            start.setHours(set.dayStart.hour, set.dayStart.mins, set.dayStart.sec, set.dayStart.mSec);
            end.setHours(set.dayEnd.hour, set.dayEnd.mins, set.dayEnd.sec, set.dayEnd.mSec);
            if (_.isString(needMonth) && needMonth === "M") {
                return new Date(dateFrom.getFullYear(), dateFrom.getMonth(), 1);
            }
            return {
                start: parseInt(start.getTime() / set.variables.mSecToSec, set.variables.decimal),
                end: parseInt(end.getTime() / set.variables.mSecToSec, set.variables.decimal)
            };
        },
        getServiceMonthStat = function (month, service) {
            var date = getDate(month, null, "M"),
                result = dataBaseService.getMonthStatisticsOnServices(pathToDBs.urlStatisticsDataDB, pathToDBs.ServiceMonthStatistics, date, service).then(function (items) {
                    return items;
                }, function (err) {
                    logger.logError(err);
                    var path = "./data/serviceMonthStatMock.json";
                    return readData(path);
                });
            return result;
        },
        /**
         * @desc:
         * Method returns an array of city day statistic from the database.
         * If the database not available -  returned mock data from JSON.
         */
        getCityDayStat = function (dateFrom, dateTo, city) {
            var date = getDate(dateFrom, dateTo),
                result = dataBaseService.getStatisticsOnCities(pathToDBs.urlStatisticsDataDB, pathToDBs.CityDayStatistics, date.start, date.end, city).then(function (items) {
                    return items;
                }, function (err) {
                    logger.logError(err);
                    var path = "./data/cityDayStatMock.json";
                    return readData(path);
                });
            return result;
        },
        getCityMonthStat = function (month, city) {
            var date = getDate(month, null, "M"),
                result = dataBaseService.getMonthStatisticsOnCities(pathToDBs.urlStatisticsDataDB, pathToDBs.CityMonthStatistics, date, city).then(function (items) {
                    return items;
                }, function (err) {
                    logger.logError(err);
                    var path = "./data/cityMonthStatMock.json";
                    return readData(path);
                });
            return result;
        },
        /**
         *  @desc: Method returns an array of current weather from the database.
         *  If the database not available -  returned mock data from JSON.
         *
         */
        getCurrentWeather = function () {
            var count = config.countFields(),
                result = dataBaseService.getLastRecords(pathToDBs.urlWeatherDataDB, pathToDBs.dataAfterMapperCollectionName, count).then(function (items) {
                    return items;
                }, function (err) {
                    logger.logError(err);
                    return readData("./data/common_data.json");

                });
            return result;
        },
        /**
         * @desc:
         * Method returns an array of day statistic from the database.
         * If the database not available -  returned mock data from JSON.
         */
        getServiceDayStat = function (dateFrom, dateTo, service) {
            var date = getDate(dateFrom, dateTo),
                result = dataBaseService.getStatisticsOnServices(pathToDBs.urlStatisticsDataDB, pathToDBs.ServiceDayStatistics, date.start, date.end, service).then(function (items) {
                    return items;
                }, function (err) {
                    logger.logError(err);
                    var path = "./data/serviceDayStatMock.json";
                    return readData(path);
                });
            return result;
        },
        getServiceStatByCities = function (dateFrom, dateTo, city) {
            var date = getDate(dateFrom, dateTo),
                result = dataBaseService.getServiceStatisticsByCities(pathToDBs.urlStatisticsDataDB, pathToDBs.ServiceDayStatisticsByCity, date.start, date.end, city).then(function (items) {
                    return items;
                }, function (err) {
                    logger.logError(err);
                    var path = "./data/serviceDayStatByCities.json";
                    return readData(path);
                });
            return result;
        },
        getServiceMonthStatByCities = function (date) {
            var result = dataBaseService.getAllStatistic(pathToDBs.urlStatisticsDataDB, pathToDBs.ServiceMonthStatisticsByCity, getDate(date).start).then(function (items) {
                return items;
            }, function (err) {
                logger.logError(err);
                var path = "./data/serviceMonthStatByCities.json";
                return readData(path);
            });
            return result;
        };

    return {
        getCurrentWeather: getCurrentWeather,
        getServiceDayStat: getServiceDayStat,
        getServiceMonthStat: getServiceMonthStat,
        getCityDayStat: getCityDayStat,
        getCityMonthStat: getCityMonthStat,
        getServiceStatByCities: getServiceStatByCities,
        getServiceMonthStatByCities: getServiceMonthStatByCities
    };
}());