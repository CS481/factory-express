import IDBConn from "./IDBConn.js";

import mongodb from "mongodb";
var MongoClient = mongodb.MongoClient;

export default class MongoConn extends IDBConn {
    static client = null;
    static db_name = process.env.DB_NAME;
    constructor() {
        super();
        if (MongoConn.client === null) {
            let {DB_USR, DB_PWD, DB_HOST} = process.env;
            DB_USR = encodeURIComponent(DB_USR);
            DB_PWD = encodeURIComponent(DB_PWD);
            let uri = `mongodb+srv://${DB_USR}:${DB_PWD}@${DB_HOST}/${MongoConn.db_name}?retryWrites=true&poolSize=20`;
            console.log("Creating a new mongodb connection...")
            MongoConn.client = new MongoClient(uri);
            console.log(`Mongodb connected to database ${MongoConn.db_name}`)
        }
    }

    /**
     * Select one record from the database
     * @param {object} queryObj Query for objects that have all the fields present in queryObj
     * @param {String} table The table to query in
     * @param {String[]} cols Only populate these fields with values from the database
     */
    async selectOne(queryObj, table, cols=[]) {
        mongoize(queryObj);
        await MongoConn.client.connect();
        try {
            let collection = this.get_collection(table);
            console.log(collection)
            let projection = {}
            cols.forEach((element) => {
                projection[element] = 1;
            });
            return normalize(await collection.findOne(queryObj, {projection: projection}));
        } finally {
            MongoConn.client.close();
        }
    }

    /**
     * Select any number of records from the database
     * @param {object} queryObj Query for objects that have all the fields present in queryObj
     * @param {String} table The table to query in
     * @param {String[]} cols Only populate these fields with values from the database
     */
    async select(queryObj, table, cols=[]) {
        mongoize(queryObj);
        await MongoConn.client.connect();
        try {
            let collection = this.get_collection(table);
            let projection = {}
            cols.forEach((element, projection) => {
                projection[element] = 1;
            });
            return new MongoCursor(await collection.find(queryObj, {projection: projection}));
        } finally {
            MongoConn.client.close();
        }
    }

    /**
     * Insert a new record into the database
     * @param {object} insertObj The object to insert into the database
     * @param {String} table The table to insert the object into
     * @returns {String} The id of the newly inserted object
     */
    async insert(insertObj, table) {
        mongoize(insertObj);
        await MongoConn.client.connect();
        try {
            let collection = this.get_collection(table);
            return collection.insertOne(insertObj);
        } finally {
            MongoConn.client.close();
        }
    }

    /**
     * Updates an existing entry in the database
     * Any fields that are not present on the updatesObj are not modified
     * @param {object} queryObj A query that describes the object to update in the database
     * @param {object} updatesObj The updates to apply to the object
     * @param {String} table The table of the object to update 
     */
    async update(queryObj, updatesObj, table) {
        mongoize(queryObj);
        mongoize(updatesObj);
        await MongoConn.client.connect();
        try {
            let collection = this.get_collection(table);
            collection.updateOne(queryObj, {$set: updatesObj});
        } finally {
            MongoConn.client.close();
        }
    }

    /**
     * Replaces an existing entry in the database
     * @param {object} queryObj A query that describes the object to replace in the database
     * @param {object} replaceObj The new object to store in the database
     * @param {String} table The table of the object to update 
     */
    async replace(queryObj, replaceObj, table) {
        mongoize(queryObj);
        mongoize(replaceObj);
        await MongoConn.client.connect();
        try {
            let collection = this.get_collection(table);
            collection.updateOne(queryObj, replaceObj);
        } finally {
            await MongoConn.client.close();
        }
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
    get_collection(name) {
        return MongoConn.client.db(MongoConn.db_name).collection(name);
    }
}

/**
 * A wrapper around the default Mongodb cursor that allows for normalization of records
 * Note: The mongodb cursor has a few more methods that I have decided not to implement for now
 */
class MongoCursor {
    constructor(cursor) {
        this.cursor = cursor;
    }

    /**
     * Executes callback on each normalized result from the cursor
     * @param {function} callback The callback to execute on each result
     */
    async forEach(callback) {
        return this.cursor.forEach(doc => {
            normalize(doc);
            callback(doc);
        });
    }

    /**
     * Implements the AsynIterator interface, which allows `for await (let doc of cursor) {...}` syntax
     */
    [Symbol.asyncIterator]() {
        return {
            async next() {
                if (await this.hasNext()) {
                    let result = await this.next();
                    return {done: false, value: result};
                } else {
                    return {done: true};
                }
            }
        };
    }

    /**
     * Returns true if this cursor has at least one more value available, or false if no values left
     * @returns {bool} Whether or not this cursor has more values
     */
    async hasNext() {
        return this.cursor.hasNext();
    }

    /**
     * Gets the next value selected by this cursor
     * @returns {object} The next value in this cursor
     */
    async next() {
        return normalize(await this.cursor.next());
    }

    /**
     * Estimate the number of documents referenced by this cursor
     * @returns {Number} The number of documents referenced by this cursor
     */
    async count() {
        return this.cursor.count();
    }

    /**
     * Reset this cursor to it's initial position in the set of returned documents
     */
    async rewind() {
        return this.cursor.rewind();
    }

    /**
     * Close this cursor and free up the resources consumed by it
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
function normalize(obj) {
    // Ignore null object, because a selectOne that finds no result returns null
    if (obj != null) {
        obj.id = obj._id;
    }
    return obj;
}

/**
 * Turn the normal looking fields into weird mongo fields
 * @param {object} obj  The object to mongoize
 * @returns {object} The mongoized object
 */
function mongoize(obj) {
    obj._id = obj.id;
    delete obj.id;
    return obj;
}