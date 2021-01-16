// Interface for objects that can be serialized and deserialized to json strings
export default class IJSONable {

    /**
     * Convert this object to a json object
     * @returns {object} The converted json object
     */
    toJsonObject() { throw Exception("Unimplemented"); }

    /**
     * Serialize this object to a json string
     * @returns {String} The serialized json string
     */
    toJson() { JSON.stringify(this.toJsonObject()); }

    /**
     * Converts a json object to an instance of this class
     * @param {object} jsonObj The json object to convert from
     * @returns {IJSONable} A new instance of this class 
     */
    static fromJsonObject(jsonObj) { throw Exception("Unimplemented"); }

    /**
     * Deserializes a json string to an instance of this class
     * @param {String} json The json string to deserialize
     * @returns {IJSONable} A new instance of this class 
     */
    static fromJson(json) { console.log(json);return this.fromJsonObject(JSON.parse(json)); }

}