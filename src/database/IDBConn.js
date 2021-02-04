import UnimplementedError from "../exception/UnimplementedError.js";

export default class IDBConn {
    /**
     * Begin a database transaction
     */
    beginTransaction() { throw new UnimplementedError(); }

    /**
     * Commit the currently active database transaction
     */
    commitTransaction() { throw new UnimplementedError(); }

    /**
     * Rollback and quit the currently active database transaction
     */
    abortTransaction() { throw new UnimplementedError(); }

    /**
     * Insert a new object into the database
     * @param {object} newObj The object to insert into the database
     * @param {String} table The table to insert into
     * @param {String[]} cols Only insert columns named by this array, or all columns if this array is left empty. Default is empty.
     * @returns {String} The id of the new database entry
     */
    insert(newObj, table, cols=[]) { throw new UnimplementedError(); }

    /**
     * Select objects from the database that match the given query
     * The selection is made by columns that are set. By default, multiple set columns are ANDed together.
     * The or() and not_set functions() can be used for more complex queries
     * @param {object} queryObj The database is queryied for entries that match this object
     * @param {String} table The table to select from
     * @param {String[]} cols Only select columns named by this array, or all column if this array is left empty. Default is empty.
     * @returns {Iterable} The results of the select
     */
    select(queryObj, table, cols=[]) { throw new UnimplementedError(); }

    /**
     * Select one entry from the database that match the given query. Similar to SELECT ... LIMIT 1
     * @param {object} queryObj The database is queryied for entries that match this object
     * @param {String} table The table to select from
     * @param {String[]} cols Only select columns named by this array, or all column if this array is left empty. Default is empty.
     * @returns {object} The result of the select
     */
    selectOne(queryObj, table, cols=[]) { throw new UnimplementedError(); }

    /**
     * Updates an existing entry in the database
     * @param {object} queryObj Only entries that match this object are updated
     * @param {object} updatesObj Updates to apply to the matching entries
     * @param {String} table The table to update in
     */
    update(queryObj, updatesObj, table) { throw new UnimplementedError(); }

    /**
     * Replaces an existing entry in the database
     * @param {object} queryObj A query that describes the object to replace in the database
     * @param {object} replaceObj The new object to store in the database
     * @param {String} table The table of the object to update 
     */
    async replace(queryObj, replaceObj, table) { throw new UnimplementedError(); }

    /**
     * Deletes an existing entry in the database
     * @param {object} queryObj A query that describes the object to replace in the database
     * @param {object} deleteObj The  object to be deleted from the database
     * @param {String} table The table of the object to update 
     */
    async delete(queryObj, deleteObj, table) { throw new Error("Unimplemented"); }

    /**
     * Applies an OR operator to the given query object.
     * The OR operator will select for any records that satisfy the conditions of any of the terms
     * @param {object} queryObj The object to apply the OR to
     * @param  {...object} terms Any number of query objects which satisfy the OR condition
     * @returns {object} queryObj
     */
    or(queryObj, ...terms) { throw new UnimplementedError(); }

    /**
     * Returns an object that indicates a given field is not set in the database
     * usage example: 
     *      user.email = conn.not_set();
     *      let db_user = conn.selectOne(user);
     * @returns {object} An object that checks for fields that are not set
     */
    not_set() { throw new UnimplementedError(); }
}
