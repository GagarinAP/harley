var MongoClient = require("mongodb").MongoClient,
    logger = require("./logger.js");
module.exports = (function () {
    "use strict";
    var getLastRecords = function (url, collectionName, count) {
            return MongoClient.connect(url).then(function (db) {
                var collection = db.collection(collectionName);
                return {
                    data: collection.find().sort({$natural: -1}).limit(count).toArray(),
                    db: db
                };
            }).then(function (items) {
                items.db.close();
                return items.data;
            });
        },
        setDataToDB = function (url, collectionName, data) {
            MongoClient.connect(url, function (error, db) {
                if (error) {
                    logger.logError(error);
                }
                var collection = db.collection(collectionName);
                collection.insertOne(data, function (error) {
                    if (error) {
                        logger.logError(error);
                    }
                    logger.logInfo("Data saved successfully to " + collectionName);
                });
                db.close();
            });
        },
        getServiceStatisticsByCities = function (url, collectionName, start, end, cityName, serviceName) {
            if (!serviceName) {
                return MongoClient.connect(url).then(function (db) {
                    var collection = db.collection(collectionName);
                    return {
                        data: collection.find({$and: [{"date": {$gte: start}}, {"date": {$lte: end}}, {"cityName": cityName}]}).toArray(),
                        db: db
                    };
                }).then(function (items) {
                    items.db.close();
                    return items.data;
                });
            } else {
                return MongoClient.connect(url).then(function (db) {
                    var collection = db.collection(collectionName);
                    return {
                        data: collection.find({$and: [{"date": {$gte: start}}, {"date": {$lte: end}}, {"cityName": cityName}, {"sourceAPI": serviceName}]}).toArray(),
                        db: db
                    };
                }).then(function (items) {
                    items.db.close();
                    return items.data;
                });
            }

        },
        getDayStatistics = function (url, collectionName, start, end) {
            return MongoClient.connect(url).then(function (db) {
                var collection = db.collection(collectionName);
                return {
                    data: collection.find({$and: [{"date": {$gt: start}}, {"date": {$lt: end}}]}).toArray(),
                    db: db
                };
            }).then(function (items) {
                items.db.close();
                return items.data;
            });
        },
        getStatisticsOnServices = function (url, collectionName, start, end, serviceName) {
            return MongoClient.connect(url).then(function (db) {
                var collection = db.collection(collectionName);
                return {
                    data: collection.find({$and: [{"date": {$gt: start}}, {"date": {$lt: end}}, {"sourceAPI": serviceName}]}).toArray(),
                    db: db
                };
            }).then(function (items) {
                items.db.close();
                return items.data;
            });
        },
        getMonthStatisticsOnServices = function (url, collectionName, start, service) {
            return MongoClient.connect(url).then(function (db) {
                var collection = db.collection(collectionName);
                return {
                    data: collection.find({$and: [{"date": {$gt: start}}, {"date": {$lt: start}}, {"sourceAPI": service}]}).toArray(),
                    db: db
                };
            }).then(function (items) {
                items.db.close();
                return items.data;
            });
        },
        getStatisticsOnCities = function (url, collectionName, start, end, cityName) {
            return MongoClient.connect(url).then(function (db) {
                var collection = db.collection(collectionName);
                return {
                    data: collection.find({$and: [{"date": {$gt: start}}, {"date": {$lt: end}}, {"cityName": cityName}]}).toArray(),
                    db: db
                };
            }).then(function (items) {
                items.db.close();
                return items.data;
            });
        },
        getMonthStatisticsOnCities = function (url, collectionName, start, cityName) {
            return MongoClient.connect(url).then(function (db) {
                var collection = db.collection(collectionName);
                return {
                    data: collection.find({$and: [{"date": {$gte: start}}, {"date": {$lte: start}}, {"cityName": cityName}]}).toArray(),
                    db: db
                };
            }).then(function (items) {
                items.db.close();
                return items.data;
            });
        },
        getAllStatistic = function (url, collectionName) {
            return MongoClient.connect(url).then(function (db) {
                var collection = db.collection(collectionName);
                return {
                    data: collection.find({}).toArray(),
                    db: db
                };
            }).then(function (items) {
                items.db.close();
                return items.data;
            });
        };
    return {
        getLastRecords: getLastRecords,
        setDataToDB: setDataToDB,
        getDayStatistics: getDayStatistics,
        getStatisticsOnServices: getStatisticsOnServices,
        getStatisticsOnCities: getStatisticsOnCities,
        getAllStatistic: getAllStatistic,
        getMonthStatisticsOnCities: getMonthStatisticsOnCities,
        getMonthStatisticsOnServices: getMonthStatisticsOnServices,
        getServiceStatisticsByCities: getServiceStatisticsByCities
    };
}());