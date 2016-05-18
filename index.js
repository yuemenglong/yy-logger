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

function stackInfo(n) {
    n = n || 0;
    // get call stack, and analyze it
    // get all file,method and line number
    var stacklist = (new Error()).stack.split('\n').slice(2 + n);
    // Stack trace format :
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    // DON'T Remove the regex expresses to outside of method, there is a BUG in node.js!!!
    var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;
    var data = {};
    var s = stacklist[0];
    var sp = stackReg.exec(s) || stackReg2.exec(s);
    if (sp && sp.length === 5) {
        data.method = sp[1];
        data.path = sp[2];
        data.line = sp[3];
        data.pos = sp[4];
        data.file = path.basename(data.path);
        data.stack = stacklist.join('\n');
    }
    return data;
}
var ext = function() {
    var info = stackInfo(8);
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

logger.log("log");
// logger.trace("trace");
// logger.debug("debug");
// logger.info("info");
// logger.warn("warn");
// logger.error("error");
// logger.fatal("fatal");
// logger.mark("mark");
