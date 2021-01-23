// import * as MongoConn from "../../database/MongoConn.js";
// import SimObj from "../../model/SimObj.js";

// // MongoConn mock
// const MongoConnImpl = MongoConn.default; // Save the unmocked copy
// const mockId = "1234";
// const mockInsert = jest.fn(() => mockId);
// MongoConn.default = jest.fn(() => {
//     return {
//         insert: mockInsert
//     }
// });

// // A simple implementation of SimObj to test with
// const childJsonObject = {color: "yellow"};
// const childTablename = "SimObjChild";
// class SimObjChild extends SimObj {
//     tablename = childTablename;

//     async modifyableBy(user) {
//         return user.canModify;
//     }

//     toJsonObject() {
//         return childJsonObject;
//     }
// }

// beforeEach(() => {
//     mockInsert.mockClear();
// });

// afterAll(() => {
//     // Unmock MongoConn
//     MongoConn.default = MongoConnImpl;
// });

// test("SimObj successfully inserts into database", done => {
//     async function test() {
//         try {
//             await new SimObjChild().insert();
//             expect(mockInsert).toHaveBeenCalledTimes(1);
//             expect(mockInsert.mock.calls[0][0]).toEqual(childJsonObject);
//             expect(mockInsert.mock.calls[0][1]).toEqual(childTablename);
//         } finally {
//             done();
//         }
//     }
//     test();
// });
