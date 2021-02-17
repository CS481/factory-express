import * as MongoConn from "../../database/MongoConn.js";
import Frame from "../../model/Frame.js";
import Simulation from "../../model/Simulation.js";
import User from "../../model/User.js";

// MongoConn mock
const MongoConnImpl = MongoConn.default; // Save the unmocked copy
const mockId = "1234";
const user1 = new User();
user1.id = "Can modify";
const user2 = new User();
user2.id = "Cannot modify";
const mockInsert = jest.fn(() => mockId);
const mockReplace = jest.fn();
const mockSelectOne = jest.fn(() => ({user: user1.id}));
MongoConn.default = jest.fn(() => {
    return {
        insert: mockInsert,
        replace: mockReplace,
        selectOne: mockSelectOne
    }
});


const mock_data = {id: mockId, user: user1.id, response_timeout: 0, resources: ["UwU"], name: "test sim"};
const expected_data = {user: user1.id, response_timeout: 0, resources: ["UwU"], name: "test sim"};

beforeEach(() => {
    mockInsert.mockClear();
    mockReplace.mockClear();
    mockSelectOne.mockClear();
});

afterAll(() => {
    // Unmock SimObj
    MongoConn.default = MongoConnImpl;
});


test("Simulation successfully initiates", done => {
    async function test() {
        try {
            let sim = new Simulation();
            await sim.init_sim(user1);
            expect(mockInsert).toHaveBeenCalledTimes(2);
            expect(mockInsert.mock.calls[0][0]).toEqual({user: user1.id});
            expect(mockInsert.mock.calls[0][1]).toEqual(new Simulation().tablename);
            expect(mockInsert.mock.calls[1][1]).toEqual(new Frame().tablename);
        } catch (e) {
            console.log(e.stack);
            done.fail();
        } finally {
            done();
        }
    }
    test();
});

// test("Simulation successfully modifies", done => {
//     async function test() {
//         try {
//             await new Simulation().modify_sim(user1, mock_data);
//             expect(mockReplace.mock.calls[0][0]).toEqual({id: mockId});
//             expect(mockReplace.mock.calls[0][1]).toEqual(expected_data);
//         } catch (e) {
//             console.log(e.stack);
//             done.fail();
//         } finally {
//             done();
//         }
//     }
//     test();
// });
