import DBConnFactory from "../database/DBConnFactory.js";
import IJSONable from "./IJSONable.js";

export default class SimObj extends IJSONable {
    id = "";
    tablename = "";

    /**
     * Populates this SimObj with fields from the database
     * Uses fields already set as the query
     * The supplied user must have permission to select this SimObj
     * TODO: A full implementation of this
     * @param {model.User} user User trying to access this SimObj
     * @throws {}
     */
    async select(user) {
        let conn = DBConnFactory();
        let result = await conn.selectOne(this.toJsonObject());
        this.fromJsonObject(result);
    }
}