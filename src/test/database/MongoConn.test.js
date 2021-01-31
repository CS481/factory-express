import MongoConn from "../../database/MongoConn.js";
import mongodb from "mongodb";
import {jest} from "@jest/globals";

var conn = new MongoConn();
const {DB_USR, DB_PWD, DB_HOST, DB_NAME} = process.env;
const uri = `mongodb+srv://${DB_USR}:${DB_PWD}@${DB_HOST}/${DB_NAME}?retryWrites=true&poolSize=20`;
var client = new mongodb.MongoClient(uri);

const selectTable = "select";
const expectedSelectResult = {"foo":"bar","num":42,"list":["hai",17.4],"subobj":{"foo":"baz"},"id": "600868d2b68eaa16d4054204"};

const insertTable = "insert";
let insertObj = {};
const updatedObj = {"foo":"baz","num":42,"list":["hai",17.4],"subobj":{"foo":"baz"}};
const replaceObj = {"some": "unrelated", "object": 1}

beforeAll(done => {
    async function before() {
        await client.connect();
        done();
    };
    before();
});

afterAll(() => {
    // async function after() {
    // client.db(DB_NAME).collection(insertTable).deleteMany({});

    // }
    MongoConn._client.close();
    client.close();
});

beforeEach(() => {
    jest.clearAllMocks();
    insertObj = {"foo":"bar","num":42,"list":["hai",17.4],"subobj":{"foo":"baz"}};
});

test("Successfully selects one object", done => {
    async function test() {
        try {
            let result = conn.selectOne({num: 42, foo: "bar"}, selectTable);
            let oneKey = conn.selectOne({num: 42, foo: "bar"}, selectTable, ["subobj"]);
            let byId = conn.selectOne({id: expectedSelectResult.id}, selectTable);

            expect(await result).toMatchObject(expectedSelectResult);
            expect(await oneKey).toMatchObject({subobj: expectedSelectResult.subobj, id: expectedSelectResult.id});
            expect(await byId).toMatchObject(expectedSelectResult);
        } finally {
            done();
        }
    };
    test();
});

test("Successfully executes advanced queries", done => {
    async function test() {
        try {
            // Query for several objects using an or
            let query = {};
            conn.or(query, {foo: "bar"}, {num: 42});
            let cursor = await conn.select(query, selectTable);
            expect(await cursor.count()).toBe(3);

            // Run through a few different ways to consume the cursor
            for await(let result of cursor) {
                expect(result.foo == "bar" || result.num == 42).toBe(true);
            }

            cursor.rewind();
            cursor.forEach(result => {
                expect(result.foo == "bar" || result.num == 42).toBe(true);
            });
        } finally {
            done();
        }
    }
    test();
});

test("Successfully inserts one object", done => {
    async function test() {
        try {
            let id = conn.insert(insertObj, insertTable);
            let findObj = {_id: mongodb.ObjectID(await id)};
            let result = await client.db(DB_NAME).collection(insertTable).findOne(findObj);
            expect(result).toMatchObject(insertObj);
        } finally {
            done();
        }
    };
    test();
});

test("Successfully updates one object", done => {
    async function test() {
        try {
            let response = await client.db(DB_NAME).collection(insertTable).insertOne(insertObj);
            let id = response.insertedId;
            await conn.update({id: id}, {"foo": "baz"}, insertTable);
            let findObj = {_id: mongodb.ObjectID(await id)};
            let result = await client.db(DB_NAME).collection(insertTable).findOne(findObj);
            // delete result._id;
            expect(result).toMatchObject(updatedObj);
        } finally {
            done();
        }
    }
    test();
});

test("Successfully replaces one object", done => {
    async function test() {
        try {
            let response = await client.db(DB_NAME).collection(insertTable).insertOne(insertObj);
            let id = response.insertedId;
            await conn.replace({id: String(id)}, replaceObj, insertTable);
            let findObj = {_id: mongodb.ObjectID(await id)};
            let result = await client.db(DB_NAME).collection(insertTable).findOne(findObj);
            // delete result._id;
            expect(result).toMatchObject(replaceObj);
        } finally {
            done();
        }
    }
    test();
});

test("Successfully deletes one object", done => {
    async function test() {
        try {
            let response = await client.db(DB_NAME).collection(insertTable).insertOne(insertObj);
            let id = response.insertedId;
            await conn.delete({id: String(id)}, deleteObj, insertTable);
            let findObj = {_id: mongodb.ObjectID(await id)};

            // This should be null as the item should have been deleted
            let result = await client.db(DB_NAME).collection(insertTable).findOne(findObj);

            // delete result._id;
            expect(result).toBeNull;
        } finally {
            done();
        }
    }
    test();
});