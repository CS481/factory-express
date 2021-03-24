import IDBConn from "./IDBConn.js";

import mongodb from "mongodb";

export default class MongoConn extends IDBConn {
    static _client = null;
    static _db_name = process.env.DB_NAME;

    constructor() {
        super();
        if (MongoConn._client === null) {
            let {DB_USR, DB_PWD, DB_HOST} = process.env;
            DB_USR = encodeURIComponent(DB_USR);
            DB_PWD = encodeURIComponent(DB_PWD);
	    DB_USR = DB_USR.replaceAll("%0D", "");
	    DB_PWD = DB_PWD.replaceAll("%0D", "");
            let uri = `mongodb+srv://${DB_USR}:${DB_PWD}@${DB_HOST}/${MongoConn._db_name}?retryWrites=true&poolSize=20`;
	    console.log(`mongodb+srv://${DB_USR}:${DB_PWD}@${DB_HOST}/${MongoConn._db_name}?retryWrites=true&poolSize=20`)
	    console.log(`${DB_USR}`)
	    console.log(`${DB_PWD}`)
   	    console.log(`${DB_HOST}`)
            console.log("Creating a new mongodb connection...")
            MongoConn._client = new mongodb.MongoClient(uri);
            MongoConn._client.connect();
        }
    }

    /**
     * Select one record from the database
     * @param {object} queryObj Query for objects that have all the fields present in queryObj
     * @param {String} table The table to query in
     * @param {String[]} cols Only populate these fields with values from the database
     */
    async selectOne(queryObj, table, cols=[]) {
        await MongoConn._connected();

        _mongoize(queryObj);
        let collection = this._get_collection(table);
        let projection = {}
        cols.forEach((element) => {
            projection[element] = 1;
        });
        return _normalize(await collection.findOne(queryObj, {projection: projection}));
    }

    /**
     * Select any number of records from the database
     * @param {object} queryObj Query for objects that have all the fields present in queryObj
     * @param {String} table The table to query in
     * @param {String[]} cols Only populate these fields with values from the database
     */
    async select(queryObj, table, cols=[]) {
        await MongoConn._connected();

        _mongoize(queryObj);
        let collection = this._get_collection(table);
        let projection = {}
        cols.forEach((element, projection) => {
            projection[element] = 1;
        });
        return new MongoCursor(await collection.find(queryObj, {projection: projection}));
    }

    /**
     * Insert a new record into the database
     * @param {object} insertObj The object to insert into the database
     * @param {String} table The table to insert the object into
     * @returns {String} The id of the newly inserted object
     */
    async insert(insertObj, table) {
        await MongoConn._connected();
        _mongoize(insertObj);
        let collection = this._get_collection(table);
        let result = await collection.insertOne(insertObj);
        return String(result.insertedId);
    }

    /**
     * Updates an existing entry in the database
     * Any fields that are not present on the updatesObj are not modified
     * @param {object} queryObj A query that describes the object to update in the database
     * @param {object} updatesObj The updates to apply to the object
     * @param {String} table The table of the object to update 
     */
    async update(queryObj, updatesObj, table) {
        await MongoConn._connected();

        _mongoize(queryObj);
        _mongoize(updatesObj);
        let collection = this._get_collection(table);
        return collection.updateOne(queryObj, {$set: updatesObj});
    }

    /**
     * Replaces an existing entry in the database
     * @param {object} queryObj A query that describes the object to replace in the database
     * @param {object} replaceObj The new object to store in the database
     * @param {String} table The table of the object to update 
     */
    async replace(queryObj, replaceObj, table) {
        await MongoConn._connected();

        _mongoize(queryObj);
        _mongoize(replaceObj);
        let collection = this._get_collection(table);
        return collection.replaceOne(queryObj, replaceObj);
    }

    /**
     * Deletes an existing entry in the database
     * @param {object} queryObj A query that describes the object to replace in the database
     * @param {object} deleteObj The  object to be deleted from the database
     * @param {String} table The table of the object to update 
     */
    async delete(queryObj, deleteObj, table) {
        await MongoConn._connected();

        _mongoize(queryObj);
        _mongoize(deleteObj);
        let collection = this._get_collection(table);
        collection.deleteOne(queryObj, deleteObj);
    }
    
    /**
     * Applies an OR operator to the given query object.
     * The OR operator will select for any records that satisfy the conditions of any of the terms
     * @param {object} queryObj The object to apply the OR to
     * @param  {...object} terms Any number of query objects which satisfy the OR condition
     * @returns {object} queryObj
     */
    or(queryObj, ...terms) {
        queryObj['$or'] = terms;
        return queryObj;
    }

    /**
     * Returns an object that indicates a given field is not set in the database
     * usage example: 
     *      user.email = conn.not_set();
     *      let db_user = conn.selectOne(user);
     * @returns {object} An object that checks for fields that are not set
     */
    not_set() {
        return {$exists: false};
    }

    /**
     * Returns an object that can be used to perform operations on a specific collection in the database
     * @param {object} name The name of the collection to operate on
     * @returns An object that can be used to perform operations on a given collection in the database
     */
    _get_collection(name) {
        return MongoConn._client.db(MongoConn._db_name).collection(name);
    }

    /**
     * Wait for the mongoclient to be connected to the database
     * @returns Promise that resolves when the mongoclient is connected
     */
    static async _connected() {
        // Wait for 1/5th of a second until the client has connected
        while(!MongoConn._client.isConnected()) {
            console.log("Waiting for client to connect...");
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        return;
    }
}

class MongoCursor {
    constructor(cursor) {
        this.cursor = cursor;
    }

    /**
     * Get the number of records this cursor selected
     * @returns {Number} The number of records selected
     */
    async count() {
        return this.cursor.count();
    }

    /**
     * Rewinds the cursor to the beginning of the selected data
     */
    async rewind() {
        return this.cursor.rewind();
    }

    /**
     * Executes the given callback on each record of the cursor
     * @param {Function} callback The callback to execute on each record
     */
    async forEach(callback) {
        return this.cursor.forEach(record => {
            record = _normalize(record);
            callback(record);
        });
    }

    /**
     * Returns whether or not this cursor has at least one more value
     * @returns {Boolean} True if this cursor has more values, or false otherwise
     */
    async hasNext() {
        return this.cursor.hasNext();
    }

    /**
     * Returns the next result in this cursor
     * @returns {Object} The next available result
     */
    async next() {
        let result = await this.cursor.next();
        _normalize(result);
        return result;
    }

    /**
     * Allow use of 'for await(let result of cursor) {...}' syntax
     */
    [Symbol.asyncIterator]() {
        return {
            cursor: this.cursor,
            hasNext: this.hasNext,
            getNext: this.next,
            async next() {
                if (!await this.hasNext()) {
                    return {done: true};
                } else {
                    return {done: false, value: await this.getNext()};
                }
            }
        };
    }

    /**
     * Close the cursor to free up the resources it consumes
     */
    async close() {
        return this.cursor.close();
    }
}

/**
 * Turn the weird mongo fields into normal looking fields
 * @param {object} obj The object retrieved from the mongo database
 * @returns {object} The normalized object
 */
function _normalize(obj) {
    // Ignore null object, because a selectOne that finds no result returns null
    if (obj != null) {
        obj.id = String(obj._id);
        delete obj._id;
    }
    return obj;
}

/**
 * Turn the normal looking fields into weird mongo fields
 * @param {object} obj  The object to mongoize
 * @returns {object} The mongoized object
 */
function _mongoize(obj) {
    if ('id' in obj) {
        obj._id = mongodb.ObjectID(obj.id);
        delete obj.id;
    }
    return obj;
}
