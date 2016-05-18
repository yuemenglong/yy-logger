var kit = require("../../cch/yy-common").kit;
// var kit = require("./kit");
// var kit = require("../kit");
var util = require("util");
var log4js = require('log4js');
var path = require("path");
var fs = require("fs");
// log4js.loadAppender('file');

var LOG_PATH = "logs/app.log";

var mkdirSync = function(dir, mode) {
    dir = path.normalize(dir);
    var folders = dir.split(path.sep);
    var cur = undefined;
    for (var i in folders) {
        var folder = folders[i];
        if (cur) {
            cur = path.join(cur, folder);
        } else {
            cur = folder;
        }
        if (!fs.existsSync(cur)) {
            fs.mkdirSync(cur, mode);
        }
    }
    return true;
}
var ext = function() {
    var info = kit.stackInfo(9);
    return util.format("%s:%d", info.file, info.line);
}
mkdirSync("logs");
log4js.configure({
    appenders: [{
        type: 'console',
        layout: {
            type: 'pattern',
            pattern: "%[[%d %p %x{ext}] - %m%]",
            tokens: {
                ext: ext,
            }
        },
    }, {
        type: "dateFile",
        filename: LOG_PATH,
        pattern: "-yyyy-MM-dd",
        alwaysIncludePattern: false,
        layout: {
            type: 'pattern',
            pattern: "[%d %p %x{ext}] - %m",
            tokens: {
                ext: ext,
            }
        },
    }]
});

var logger = log4js.getLogger();
logger.log = logger.mark;

module.exports = logger;


logger.trace("trace");
// logger.debug("debug");
// logger.info("info");
// logger.warn("warn");
// logger.error("error");
// logger.fatal("fatal");
// logger.mark("mark");
