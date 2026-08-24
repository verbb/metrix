export default class MetrixConfig {
    constructor(instance) {
        this.instance = instance;
        this.registeredWidgets = {};
    }

    registerWidget(type, component) {
        this.registeredWidgets[type] = component;
    }

    getRegisteredWidget(type) {
        return this.registeredWidgets[type] || null;
    }
}
