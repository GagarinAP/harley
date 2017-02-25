var settingsPath = "./config/settings.json",
    configPath = "./config/config.json",
    logger = require("./logger.js"),
    set = require("./../config/settings.json"),
    _ = require("lodash"),
    fs = require("fs");

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
        writeData = function (data, path) {
            try {
                fs.writeFileSync(
                    path,
                    JSON.stringify(data),
                    {flag: "w+"}
                );
            } catch (e) {
                logger.logError(set.messages.fs.cantWriteToFile +
                    JSON.stringify(data));
                return false;
            }
            return true;
        },
        config = readData(configPath),
        getCitiesURLs = function () {
            var configsApiUrls = [];
            _.each(config.cities, function (city) {
                var cityName = "";
                if (city.wundergroundName) {
                    cityName = city.wundergroundName;
                } else {
                    cityName = city.name;
                }
                _.each(config.services, function (service) {
                    switch (service.name) {
                        case "openWeather":
                            configsApiUrls.push({
                                name: service.name,
                                city: cityName,
                                url: service.urlPart1 + cityName + service.urlPart2
                            });
                            break;
                        case "wunderground":
                            configsApiUrls.push({
                                name: service.name,
                                city: cityName,
                                url: service.urlPart1 + cityName + service.urlPart2
                            });
                            break;
                        case "darkSky":
                            configsApiUrls.push({
                                name: service.name,
                                city: cityName,
                                url: service.urlPart1 + city.xCords.toFixed(2) + "," + city.yCords.toFixed(2)
                            });
                            break;
                    }
                });
            });

            return configsApiUrls;
        },
        getServicesNames = function () {
            var servicesNames = [];
            _.each(config.services, function (service) {
                servicesNames.push(service.name);
            });
            return servicesNames;
        },
        getTotalConfig = function () {
            return config;
        },
        getSettings = function () {
            return readData(settingsPath);
        },
        updateSettings = function (fieldName, data) {
            var settings = readData(settingsPath);
            _.each(settings, function (setField) {
                if (fieldName === setField) {
                    settings[fieldName] = data;
                }
            });
            writeData(settings, settingsPath);
        },
        countFields = function () {
            var count = 0;
            _.each(config.services, function (service) {
                _.each(config.cities, function (city) {
                    count += 1;
                });
            });
            return count;
        };


    return {
        getCitiesURLs: getCitiesURLs,
        getTotalConfig: getTotalConfig,
        getServicesNames: getServicesNames,
        updateSettings: updateSettings,
        countFields: countFields,
        getSettings: getSettings
    };
}());
