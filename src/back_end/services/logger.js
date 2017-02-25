var fs = require("fs"),
    set = require("./../config/settings.json");

var SEPARATOR = " | ",
    ENDLINE = "\r\n";

module.exports = (function (isDebugModeOn) {
    "use strict";
    var path = "./logs/log.txt",
        getCurrentTime = function () {
            var now = new Date();
            return [
                now.getUTCFullYear(),
                "-",
                now.getUTCMonth() + 1,
                "-",
                now.getUTCDate(),
                " ",
                now.getUTCHours() + 2,
                ":",
                now.getUTCMinutes(),
                ":",
                now.getUTCSeconds()
            ].join("");
        },
        writeMessageToFile = function (message) {
            console.log(message);
            fs.writeFileSync(path, message, { encoding: "utf8", flag: "a+"}, function (err) {
                if (err) {
                    throw {
                        "message": set.messages.logger.failToWrite
                    };
                }
            });
        },
        logError = function (message) {
            writeMessageToFile(set.messages.logger.error + SEPARATOR + getCurrentTime() + SEPARATOR + message + ENDLINE);
        },
        logWarning = function (message) {
            writeMessageToFile(set.messages.logger.warning + SEPARATOR + getCurrentTime() + SEPARATOR + message + ENDLINE);
        },
        logDebug = function (message) {
            if (isDebugModeOn) {
                writeMessageToFile(set.messages.logger.debug + SEPARATOR + getCurrentTime() + SEPARATOR + message + ENDLINE);
            }
        },
        logInfo = function (message) {
            writeMessageToFile(set.messages.logger.info + SEPARATOR + getCurrentTime() + SEPARATOR + message + ENDLINE);
        };

    return {
        logDebug: logDebug,
        logWaring: logWarning,
        logError: logError,
        logInfo: logInfo,
        getCurrentTime: getCurrentTime
    };
}());
