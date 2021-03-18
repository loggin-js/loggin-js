class EmptyRegistry {
    constructor() {

    }

    add(name, instance) {
        throw new Error('EmptyRegistry, this should not happen... yaiks!');
    }

    register(name, template, options = {}) {
        throw new Error('EmptyRegistry, this should not happen... yaiks!');
    }

    get(name) {
        throw new Error('EmptyRegistry, this should not happen... yaiks!');
    }

    search(name) {
        throw new Error('EmptyRegistry, this should not happen... yaiks!');
    }
}

module.exports = EmptyRegistry;