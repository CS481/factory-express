import DBConnFactory from "../database/DBConnFactory.js";
import IJSONable from "./IJSONable.js";

export default class SimObj extends IJSONable {
    id = "";
    tablename = "";

    /**
     * Populates this SimObj with fields from the database
     * Uses fields already set as the query
     * @throws If this SimObj does not exist in the database
     */
    async select() {
        let conn = DBConnFactory();
        let result = await conn.selectOne(this.toJsonObject(), this.tablename);
        if (result == null) {
            throw new Error("The requested SimObj cannot be found in the database");
        }
        this.fromJsonObject(result);
    }

    /**
     * Inserts this SimObj as a new entry in the database
     * @returns {String} The id of the new entry
     * @throws If id is already set
     */
    async insert() {
        if (this.id != "") {
            throw new Error(`Cannot insert new SimObj because id already set to ${this.id}`);
        }
        let conn = DBConnFactory();
        this.id = await conn.insert(this.toJsonObject(), this.tablename);
        return this.id;
    }

    /**
     * Update this SimObj in the database
     * @param {model.User} user The user updating this SimObj
     * @throws If user does not have permission to update this object
     */
    async update(user) {
        if (!(await this.modifyableBy(user))) {
            throw new Error("This user does not have permissions to update this SimObj");
        }
        let conn = DBConnFactory();
        conn.update({id: this.id}, this.toJsonObject(), this.tablename);
    }

    /**
     * Update this SimObj in the database
     * @param {model.User} user The user updating this SimObj
     * @throws If user does not have permission to update this object
     */
    async replace(user) {
        if (!(await this.modifyableBy(user))) {
            throw new Error("This user does not have permissions to update this SimObj");
        }
        let conn = DBConnFactory();
        conn.replace({id: this.id}, this.toJsonObject(), this.tablename);
    }

    /**
     * Returns whether or not this SimObj can be modified by user
     * @param {mode.User} user The user trying to modify this SimObj
     * @returns {bool} True if user can modify this SimObj, or false otherwise
     */
    async modifyableBy(user) { throw new Error("Unimplemented"); }
}
