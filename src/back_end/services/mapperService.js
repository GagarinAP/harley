var set = require("./../config/settings.json"),
    config = require("./../config/config.json"),
    _ = require("lodash"),
    logger = require("./logger.js");
module.exports = (function () {
    "use strict";
    var getFallOut = function (weather, serviceName) {
            var fallOut = "none";
            _.each(config.services, function (service) {
                if (service.name === serviceName) {
                    _.each(service.variables.fallOut, function (type) {
                        _.each(type.array, function (weatherType) {
                            if (weather === weatherType) {
                                fallOut = type.name;
                            }
                        });
                    });
                }
            });
            return fallOut;
        },
        prepareData = function (city, temp, pressure, humidity, windSpeed, windDir, clouds,
                                fallOut, sourceAPI, longitude, latitude, date) {
            return {
                "cityName": city,
                "temp": temp,
                "pressure": pressure,
                "humidity": humidity,
                "windSpeed": windSpeed,
                "windDir": windDir,
                "clouds": clouds,
                "fallOut": fallOut,
                "sourceAPI": sourceAPI,
                "coords": {
                    "lon": longitude,
                    "lat": latitude
                },
                "date": date
            };
        },
        prepareDataFromOpenWeather = function (serviceName, city, data) {
            var tempInCelsius = parseFloat((data.main.temp - set.variables.fahrenheitToCelsius).toFixed(2)),
                windSpeedInKmH = parseFloat((data.wind.speed * set.variables.metersInSecToKmH).toFixed(2)),
                result = prepareData(city, tempInCelsius, data.main.pressure, data.main.humidity,
                    windSpeedInKmH, data.wind.deg, data.clouds.all, getFallOut(_.first(data.weather).main, serviceName),
                    serviceName, data.coord.lon, data.coord.lat, data.dt);
            if (result.length === 0) {
                logger.logError("No data from service " + serviceName);
            } else {
                logger.logInfo("Data from " + serviceName + " collected");
            }
            return result;
        },
        prepareDataFromWunderground = function (serviceName, city, data) {
            var humidity = parseInt((data.current_observation.relative_humidity).replace(/%/g, ""), 10),
                result = prepareData(city, parseFloat(data.current_observation.temp_c), parseFloat(data.current_observation.pressure_mb),
                    humidity, parseFloat(data.current_observation.wind_gust_kph), data.current_observation.wind_degrees, null,
                    getFallOut(data.current_observation.icon, serviceName), serviceName, parseFloat(data.current_observation.display_location.longitude),
                    parseFloat(data.current_observation.display_location.latitude), parseFloat(data.current_observation.local_epoch));
            if (result.length === 0) {
                logger.logError("No data from service " + serviceName);
            } else {
                logger.logInfo("Data from " + serviceName + " collected");
            }
            return result;
        },
        prepareDataFromDarkSky = function (serviceName, city, data) {
            var tempInCelsius = parseFloat(((data.currently.temperature - 32) * (5 / 9)).toFixed(2)),
                windSpeedInKmH = parseFloat(((data.currently.windSpeed) * set.variables.milesToKm).toFixed(2)),
                result = prepareData(city, tempInCelsius, data.currently.pressure, data.currently.humidity * 100, windSpeedInKmH,
                    data.currently.windBearing, data.currently.cloudCover * 100, getFallOut(data.currently.icon, serviceName), serviceName,
                    data.longitude, data.latitude, data.currently.time);
            if (result.length === 0) {
                logger.logError("No data from service " + serviceName);
            } else {
                logger.logInfo("Data from " + serviceName + " collected");
            }
            return result;
        },
        prepareDataFromService = function (serviceName, city, data) {
            var result = {};
            switch (serviceName) {
                case "openWeather":
                    result = prepareDataFromOpenWeather(serviceName, city, data);
                    break;
                case "darkSky":
                    result = prepareDataFromDarkSky(serviceName, city, data);
                    break;
                case "wunderground":
                    result = prepareDataFromWunderground(serviceName, city, data);
                    break;
            }
            return result;
        };
    return {
        prepareDataFromService: prepareDataFromService
    };

}());
