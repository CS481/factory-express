export default class IDBConn {
    /**
     * Begin a database transaction
     */
    beginTransaction() { throw Exception("Unimplemented"); }
    /**
     * Commit the currently active database transaction
     */
    commitTransaction() { throw Exception("Unimplemented"); }
    /**
     * Rollback and quit the currently active database transaction
     */
    abortTransaction() { throw Exception("Unimplemented"); }

    /**
     * Insert a new object into the database
     * @param {object} newObj The object to insert into the database
     * @param {String} table The table to insert into
     * @param {String[]} cols Only insert columns named by this array, or all columns if this array is left empty. Default is empty.
     * @returns {String} The id of the new database entry
     */
    insert(newObj, table, cols=[]) { throw Exception("Unimplemented"); }

    /**
     * Select objects from the database that match the given query
     * The selection is made by columns that are set. By default, multiple set columns are ANDed together.
     * The or() and not_set functions() can be used for more complex queries
     * @param {object} queryObj The database is queryied for entries that match this object
     * @param {String} table The table to select from
     * @param {String[]} cols Only select columns named by this array, or all column if this array is left empty. Default is empty.
     * @returns {Iterable} The results of the select
     */
    select(queryObj, table, cols=[]) { throw Exception("Unimplemented"); }

    /**
     * Select one entry from the database that match the given query. Similar to SELECT ... LIMIT 1
     * @param {object} queryObj The database is queryied for entries that match this object
     * @param {String} table The table to select from
     * @param {String[]} cols Only select columns named by this array, or all column if this array is left empty. Default is empty.
     * @returns {object} The result of the select
     */
    selectOne(queryObj, table, cols=[]) { throw Exception("Unimplemented"); }

    /**
     * Updates an existing entry in the database
     * @param {object} queryObj Only entries that match this object are updated
     * @param {object} updatesObj Updates to apply to the matching entries
     * @param {String} table The table to update in
     */
    update(queryObj, updatesObj, table) { throw Exception("Unimplemented"); }

    /**
     * Deletes entries from the database
     * @param {object} queryObj Only entries that match this object are deleted
     * @param {String} table The table to delete from
     */
    delete(queryObj, table) { throw Exception("Unimplemented"); }
}