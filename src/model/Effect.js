import IJSONable from "./IJSONable.js";
import SimObj from "./SimObj.js";

export default class Effect extends IJSONable {
    toJsonObject() {
        return {
            effects: this.effects,
            resource: this.resource,
            operation: this.operation
        }
    }

    fromJsonObject(jsonObj) {
        this.effects = jsonObj.effects;
        this.resource = jsonObj.resource;
        this.operation = jsonObj.operation;
        return this;
    }
}
