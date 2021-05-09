import IJSONable from "./IJSONable.js";
import SimObj from "./SimObj.js";

export default class AllSims extends IJSONable {
    async toJsonObject() {
        let obj = {
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
     * Not a traditional implementation of this method; 
     */
    async fromJsonObject(obj) {
        this.name = obj.name;
    }
}