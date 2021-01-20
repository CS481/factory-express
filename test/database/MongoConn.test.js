import MongoConn from "../../database/MongoConn.js";

var conn = new MongoConn();

const selectTable = "select";
const expectedSelectResult = {"foo":"bar","num":42,"list":["hai",17.4],"subobj":{"foo":"baz"},"_id":{"$oid":"600868d2b68eaa16d4054204"}};

test("Successfully selects one object", done => {
    async function test() {
        let result = await conn.selectOne({}, selectTable);
        expect(result).toBe(expectedSelectResult);
        done();
    }
    test();
});
