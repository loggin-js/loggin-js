class EmptyRegistry {
    constructor() {
        this._registry = {};
    }

    /* istanbul ignore next */
    clear() {
        this._registry = {};
    }

    /* istanbul ignore next */
    add(name, instance) {
        throw new Error('EmptyRegistry, this should not happen... yaiks!');
    }

    /* istanbul ignore next */
    register(name, template, options = {}) {
        throw new Error('EmptyRegistry, this should not happen... yaiks!');
    }

    /* istanbul ignore next */
    get(name) {
        throw new Error('EmptyRegistry, this should not happen... yaiks!');
    }

    /* istanbul ignore next */
    search(name) {
        throw new Error('EmptyRegistry, this should not happen... yaiks!');
    }
}

module.exports = EmptyRegistry;