import IJSONable from "./IJSONable.js";
import SimObj from "./SimObj.js";

export default class AllSims extends IJSONable {
    async toJsonObject() {
        let obj = {
            id: this.id,
            name: this.name
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
        this.id = obj.id;
        this.name = obj.name;
    }
}
