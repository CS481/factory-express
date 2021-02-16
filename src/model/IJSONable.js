import UnimplementedError from "../exception/UnimplementedError.js";

// Interface for objects that can be serialized and deserialized to json strings
export default class IJSONable {

    /**
     * Convert this object to a json object
     * @returns {object} The converted json object
     */
    async toJsonObject() { throw new UnimplementedError(); }

    /**
     * Serialize this object to a json string
     * @returns {String} The serialized json string
     */
    async toJson() { JSON.stringify(this.toJsonObject()); }

    /**
     * Converts a json object to an instance of this class
     * @param {object} jsonObj The json object to convert from
     * @returns {IJSONable} A new instance of this class 
     */
    async fromJsonObject(jsonObj) {
        Object.keys(jsonObj).map((key, _) => {
            this[key] = jsonObj[key];
        }); 
    }

    /**
     * Deserializes a json string to an instance of this class
     * @param {String} json The json string to deserialize
     * @returns {IJSONable} A new instance of this class 
     */
    async fromJson(json) { return this.fromJsonObject(JSON.parse(json)); }
}
