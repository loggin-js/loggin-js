const os = require('os');
const path = require('path');

function isFunction(val) {
    return val && val.apply !== undefined; 
}

function isConstructor(obj) {
    return !!obj.prototype && !!obj.prototype.constructor.name;
}


function getOsUsername() {
    os.userInfo ? os.userInfo().username : 'jhon';
}

function getFileBasename() {
    return path.basename(__filename);
}

module.exports.isFunction = isFunction;
module.exports.isConstructor = isConstructor;
module.exports.getFileBasename = getFileBasename;
module.exports.getOsUsername = getOsUsername;