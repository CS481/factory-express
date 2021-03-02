import IJSONable from "./IJSONable.js";
import SimObj from "./SimObj.js";

export default class StateHistory extends IJSONable {
    async toJsonObject() {
        let obj = {
            resources: this.resources,
            user_history: this.user_history
        };
        Object.keys(obj).forEach((key, _) => {
            if (obj[key] == undefined) {
                delete obj[key];
            }
        });
        return obj;
    }

    /**
     * Not a traditional implementation of this method; creates a StateHistory from a SimulationInstance
     */
    async fromJsonObject(obj) {
        this.resources = obj.resources;
        this.user_history = obj.player_responses;
    }
}
