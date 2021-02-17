import IJSONable from "./IJSONable.js";
import SimObj from "./SimObj.js";

export default class Effect extends IJSONable {
    toJsonObject() {
        return {
            user_waiting: this.user_responses,
            turn_number: this.resources,
            response_deadline: this.resource_deltas,
            resources: this.resources,
            resource_deltas: this.resource_deltas,
            history: this.history.map(h => h.toJsonObject()),
            prompt: this.prompt,
            responses: this.responses
        }
    }

    fromJsonObject(jsonObj) {
        this.user_waiting = jsonObj.user_waiting;
        this.turn_number = jsonObj.turn_number;
        this.response_deadline = jsonObj.response_deadline;
        this.resources = jsonObj.resources;
        this.resource_deltas = jsonObj.resource_deltas;
        this.history = jsonObj.history.map(h => h.fromJsonObject());
        this.prompt = jsonObj.prompt;
        this.responses = jsonObj.responses;
        return this;
    }
}
