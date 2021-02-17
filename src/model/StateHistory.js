import IJSONable from "./IJSONable.js";
import SimObj from "./SimObj.js";

export default class Effect extends IJSONable {
    toJsonObject() {
        return {
            user_responses: this.user_responses,
            resources: this.resources,
            resource_deltas: this.resource_deltas
        }
    }

    fromJsonObject(jsonObj) {
        this.user_responses = jsonObj.user_responses;
        this.resources = jsonObj.resources;
        this.resource_deltas = jsonObj.resource_deltas;
        return this;
    }
}
