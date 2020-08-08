const bunyan = require('bunyan');

exports.getLogger = function (name) {
    return bunyan.createLogger({name});
};
