// var kit = require("../../cch/yy-common").kit;
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

function ext() {
    var stack = (new Error()).stack;
    var stacklist = stack.split('\n').slice(10);
    var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;
    var info = {};
    var s = stacklist[0];
    var sp = stackReg.exec(s) || stackReg2.exec(s);
    if (sp && sp.length === 5) {
        info.method = sp[1];
        info.path = sp[2];
        info.line = sp[3];
        info.pos = sp[4];
        info.file = path.basename(info.path);
        info.stack = stacklist.join('\n');
    }
    return util.format("%s:%d", info.file, info.line);
}

var config = {
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
}

var getLogger = function() {
    mkdirSync("logs");
    log4js.configure(config);
    var logger = log4js.getLogger();
    logger.log = logger.mark;

    logger.setFileName = function(name) {
        config.appenders[1].filename = "logs/" + name;
        log4js.configure(config);
    }

    return logger;
}

module.exports = getLogger();
