function isFunction(val) {
    return val && val.apply !== undefined; //  typeof val === 'function';
}

module.exports.isFunction = isFunction;