import IDBConn from "./IDBConn.js";

import mongodb from "mongodb";
var MongoClient = mongodb.MongoClient;

export default class MongoConn extends IDBConn {
    static client = null;
    static db_name = process.env.DB_NAME;
    constructor() {
        super();
        if (MongoConn.client === null) {
            let {DB_USR, DB_PWD, DB_HOST, DB_PORT} = process.env;
            DB_USR = encodeURIComponent(DB_USR);
            DB_PWD = encodeURIComponent(DB_PWD);
            let uri = `mongodb://${DB_USR}:${DB_PWD}@${DB_HOST}:${DB_PORT}/?poolSize=20`
            console.log(uri)
            MongoConn.client = new MongoClient(uri);
            console.log(MongoConn.client)
        }
    }

    async selectOne(queryObj, table, cols=[]) {
        await MongoConn.client.connect();
        try {
            let collection = client.db(MongoConn.db_name).collection(table);
            let projection = {}
            cols.forEach((element, projection) => {
                projection[element] = 1;
            });
            return collection.findOne(queryObj, {projection: projection});
        } finally {
            await MongoConn.client.close();
        }
    }
}