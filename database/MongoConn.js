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
            // let uri = `mongodb://${DB_USR}:${DB_PWD}@${DB_HOST}:${DB_PORT}/?poolSize=20`
            let uri = `mongodb+srv://${DB_USR}:${DB_PWD}@${DB_HOST}/${MongoConn.db_name}?retryWrites=true&w=majority&poolSize=20`;
            console.log("Creating a new mongodb connection...")
            console.log(uri);
            MongoConn.client = new MongoClient(uri);
            console.log("New mongodb connection created")
        }
    }

    async selectOne(queryObj, table, cols=[]) {
        await MongoConn.client.connect();
        try {
            let collection = MongoConn.client.db(MongoConn.db_name).collection(table);
            let projection = {}
            cols.forEach((element, projection) => {
                projection[element] = 1;
            });
            return this.normalize(await collection.findOne(queryObj, {projection: projection}));
        } finally {
            await MongoConn.client.close();
        }
    }

    /**
     * Turn the weird mongo fields into normal looking fields
     * @param {object} obj The object retrieved from the mongo database
     * @returns {object} The normalized object
     */
    normalize(obj) {
        obj.id = obj._id;
        return obj;
    }
}