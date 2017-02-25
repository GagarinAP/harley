var config = require("./ConfigService.js"),
    dataBaseService = require("./DataBaseService"),
    _ = require("lodash"),
    logger = require("./logger.js"),
    set = require("./../config/settings.json"),
    pathToDBs = require("./../config/pathConfig.json");
module.exports = (function () {
    "use strict";
    var minValue = function (paramName, data, cityNameNeeded) {
            var lowest = Number.POSITIVE_INFINITY,
                fieldName = set.variables.min_ + paramName,
                result = {},
                city = "";
            _.each(data, function (item) {
                if (item[paramName] < lowest) {
                    lowest = item[paramName];
                    city = item.cityName;
                }
                if (cityNameNeeded) {
                    result[fieldName] = lowest;
                    result.cityName = city;
                }
            });
            if (cityNameNeeded) {
                return result;
            }
            return lowest;

        },
        maxValue = function (paramName, data, cityNameNeeded) {
            var highest = Number.NEGATIVE_INFINITY,
                fieldName = set.variables.max_ + paramName,
                result = {},
                city = "";
            _.each(data, function (item) {
                if (item[paramName] > highest) {
                    highest = item[paramName];
                    city = item.cityName;
                }
                if (cityNameNeeded) {
                    result[fieldName] = highest;
                    result.cityName = city;
                }
            });
            if (cityNameNeeded) {
                return result;
            }
            return highest;
        },

        avgValue = function (paramName, data, cityNameNeeded) {
            var avg = 0,
                fieldName = set.variables.avg + paramName,
                result = {};
            _.each(data, function (item) {
                avg += item[paramName];
                if (cityNameNeeded) {
                    result[fieldName] = avg / data.length;
                    result.cityName = item.cityName;
                }
            });
            if (cityNameNeeded) {
                return result;
            }
            return avg / data.length;
        },
        getResultData = function (dataArr, cityName, serviceName) {
            var output,
                citiesAndServices = {
                    date: _.first(dataArr).date,
                    cityName: cityName,
                    sourceAPI: serviceName
                },
                onlyCities = {
                    date: _.first(dataArr).date,
                    cityName: cityName
                },
                onlyServices = {
                    date: _.first(dataArr).date,
                    sourceAPI: serviceName
                },
                commonPart = {
                    temp: {
                        min: minValue(set.variables.temp, dataArr),
                        max: maxValue(set.variables.temp, dataArr),
                        avg: avgValue(set.variables.temp, dataArr)
                    },
                    humidity: {
                        min: minValue(set.variables.humidity, dataArr),
                        max: maxValue(set.variables.humidity, dataArr),
                        avg: avgValue(set.variables.humidity, dataArr)
                    },
                    windSpeed: {
                        min: minValue(set.variables.windSpeed, dataArr),
                        max: maxValue(set.variables.windSpeed, dataArr),
                        avg: avgValue(set.variables.windSpeed, dataArr)
                    },
                    pressure: {
                        min: minValue(set.variables.pressure, dataArr),
                        max: maxValue(set.variables.pressure, dataArr),
                        avg: avgValue(set.variables.pressure, dataArr)
                    }
                };
            if (cityName !== 0 && serviceName !== 0) {
                citiesAndServices.stat = commonPart;
                output = citiesAndServices;
            } else if (serviceName === 0 && cityName !== 0) {
                onlyCities.stat = commonPart;
                output = onlyCities;
            } else if (serviceName !== 0 && cityName === 0) {
                onlyServices.stat = commonPart;
                output = onlyServices;
            }
            return output;
        },

        getTime = function (searchTime, timePeriodNeeded) {
            var dayStart = new Date(),
                dayEnd = new Date();
            switch (timePeriodNeeded) {
                case "day":
                    dayStart = new Date(searchTime.getTime());
                    dayEnd = new Date(searchTime.getTime());
                    break;
                case "month":
                    dayStart = new Date(searchTime.getFullYear(), searchTime.getMonth(), 1);
                    dayEnd = new Date(searchTime.getFullYear(), searchTime.getMonth() + 1, 0);
                    break;
            }
            dayStart.setHours(set.dayStart.hour, set.dayStart.mins, set.dayStart.sec, set.dayStart.mSec);
            dayEnd.setHours(set.dayEnd.hour, set.dayEnd.mins, set.dayEnd.sec, set.dayEnd.mSec);
            return {
                dayStart: parseInt(dayStart.getTime() / set.variables.mSecToSec, set.variables.decimal),
                dayEnd: parseInt(dayEnd.getTime() / set.variables.mSecToSec, set.variables.decimal)
            };
        },
        serviceDayStatisticByCity = function (searchTime) {
            var cities = [],
                time = getTime(searchTime, "day");
            _.each(config.getCitiesURLs(), function (city) {
                cities.push(city.city);
            });
            _.each(_.uniq(cities), function (cityName) {
                _.each(_.uniq(config.getServicesNames()), function (serviceName) {
                    dataBaseService.getServiceStatisticsByCities(pathToDBs.urlWeatherDataDB, pathToDBs.dataAfterMapperCollectionName,
                        time.dayStart, time.dayEnd, cityName, serviceName).then(function (dataArr) {
                        logger.logInfo("Data services successfully collected!");
                        dataBaseService.setDataToDB(pathToDBs.urlStatisticsDataDB, pathToDBs.ServiceDayStatisticsByCity, getResultData(dataArr, cityName, serviceName));
                    }, function (err) {
                        logger.logError(err);
                    });
                });

            });
        },
        serviceMonthStatisticByCity = function (searchTime) {
            var time = getTime(searchTime, "month"),
                cities = [];
            _.each(config.getCitiesURLs(), function (city) {
                cities.push(city.city);
            });
            _.each(_.uniq(cities), function (cityName) {
                _.each(_.uniq(config.getServicesNames()), function (serviceName) {
                    dataBaseService.getServiceStatisticsByCities(pathToDBs.urlWeatherDataDB, pathToDBs.dataAfterMapperCollectionName,
                        time.dayStart, time.dayEnd, cityName, serviceName).then(function (dataArr) {
                        logger.logInfo("Data services successfully collected!");
                        dataBaseService.setDataToDB(pathToDBs.urlStatisticsDataDB, pathToDBs.ServiceMonthStatisticsByCity, getResultData(dataArr, cityName, serviceName));
                    }, function (err) {
                        logger.logError(err);
                    });
                });

            });
        },
        cityDayStatistics = function (searchTime) {
            var service = 0,
                time = getTime(searchTime, "day"),
                cities = [];
            _.each(config.getCitiesURLs(), function (city) {
                cities.push(city.city);
            });
            _.each(_.uniq(cities), function (cityName) {
                dataBaseService.getStatisticsOnCities(pathToDBs.urlWeatherDataDB, pathToDBs.dataAfterMapperCollectionName,
                    time.dayStart, time.dayEnd, cityName).then(function (dataArr) {
                    logger.logInfo("Data services successfully collected!");
                    dataBaseService.setDataToDB(pathToDBs.urlStatisticsDataDB, pathToDBs.CityDayStatistics, getResultData(dataArr, cityName, service));
                }, function (err) {
                    logger.logError(err);
                });
            });
        },
        cityMonthStatistics = function (searchTime) {
            var service = 0,
                time = getTime(searchTime, "month"),
                cities = [];
            _.each(config.getCitiesURLs(), function (city) {
                cities.push(city.city);
            });
            _.each(_.uniq(cities), function (cityName) {
                dataBaseService.getStatisticsOnCities(pathToDBs.urlWeatherDataDB, pathToDBs.dataAfterMapperCollectionName,
                    time.dayStart, time.dayEnd, cityName).then(function (dataArr) {
                    logger.logInfo("Data services successfully collected!");
                    dataBaseService.setDataToDB(pathToDBs.urlStatisticsDataDB, pathToDBs.CityMonthStatistics, getResultData(dataArr, cityName, service));
                }, function (err) {
                    logger.logError(err);
                });
            });
        },
        serviceDayStatistics = function (searchTime) {
            var cityName = 0,
                time = getTime(searchTime, "day");
            _.each(config.getServicesNames(), function (service) {
                dataBaseService.getStatisticsOnServices(pathToDBs.urlWeatherDataDB, pathToDBs.dataAfterMapperCollectionName,
                    time.dayStart, time.dayEnd, service).then(function (dataArr) {
                    logger.logInfo("Data services successfully collected!");
                    var res = getResultData(dataArr, cityName, service);
                    dataBaseService.setDataToDB(pathToDBs.urlStatisticsDataDB, pathToDBs.ServiceDayStatistics, res);
                }, function (err) {
                    logger.logError(err);
                });
            });
        },
        serviceMonthStatistics = function (searchTime) {
            var cityName = 0,
                time = getTime(searchTime, "month");
            _.each(config.getServicesNames(), function (service) {
                dataBaseService.getStatisticsOnServices(pathToDBs.urlWeatherDataDB, pathToDBs.dataAfterMapperCollectionName,
                    time.dayStart, time.dayEnd, service).then(function (dataArr) {
                    logger.logInfo("Data services successfully collected!");
                    dataBaseService.setDataToDB(pathToDBs.urlStatisticsDataDB, pathToDBs.ServiceMonthStatistics, getResultData(dataArr, cityName, service));
                }, function (err) {
                    logger.logError(err);
                });
            });
        };

    return {
        serviceDayStatistics: serviceDayStatistics,
        serviceMonthStatistics: serviceMonthStatistics,
        cityDayStatistics: cityDayStatistics,
        cityMonthStatistics: cityMonthStatistics,
        serviceDayStatisticByCity: serviceDayStatisticByCity,
        serviceMonthStatisticByCity: serviceMonthStatisticByCity
    };
}());