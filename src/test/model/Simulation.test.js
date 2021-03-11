import * as MongoConn from "../../database/MongoConn.js";
import Simulation from "../../model/Simulation.js";
import SimulationInstance from "../../model/SimulationInstance.js";
import User from "../../model/User.js";

const mockId = "1234";
const facilitator = {id: "faciltatory mcfacilitatorface"};
const user1 = {id: "user1"};

const mock_simulation = {
    id: mockId,
    facilitator: facilitator.id,
    user_count: 2,
    name: "simmy mcsimface",
    prompt: "prompty mcpromptface",
    round_count: 10,
    resources: [
        { name: "resourcy mcresourceface", equation: "mx+b", starting_value: 180 }
    ],
    user_resources: [
        { name: "user resourcy mcresourceface", equation: "umx+b", starting_value: 50 }
    ]
};
const instance_result = {
    simulation: mockId,
    deadline: -1,
    turn_number: 0,
    user_count: 1,
    resources: {"resourcy mcresourceface": 180},
    player_responses: [
        {user: user1.id, resources: {"user resourcy mcresourceface": 50}}
    ]
};

// MongoConn mock
const MongoConnImpl = MongoConn.default; // Save the unmocked copy

// MongoCursor mock
var cursor_call_count = 0;
const mockForEach = jest.fn((func) => {
    if (cursor_call_count == 0) {
        return null;
    } else {
        return func(instance_result);
    }
});
const mongoCursor = jest.fn(() => {
    return {
        forEach: mockForEach
    }
});

const user2 = new User();
user2.id = "Cannot modify";
const mockInsert = jest.fn(() => mockId);
const mockUpdate = jest.fn();
const mockSelectOne = jest.fn(() => mock_simulation);
const mockSelect = jest.fn(() => mongoCursor());
MongoConn.default = jest.fn(() => {
    return {
        insert: mockInsert,
        update: mockUpdate,
        selectOne: mockSelectOne,
        select: mockSelect
    }
});

const mock_data = {id: mockId, user: user1.id, response_timeout: 0, resources: ["UwU"], name: "test sim"};
const expected_data = {user: user1.id, response_timeout: 0, resources: ["UwU"], name: "test sim"};

beforeEach(() => {
    mockInsert.mockClear();
    mockUpdate.mockClear();
    mockSelectOne.mockClear();
    mockSelect.mockClear();
    cursor_call_count = 0;
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
            expect(mockInsert).toHaveBeenCalledTimes(1);
            expect(mockInsert.mock.calls[0][0]).toEqual({user: user1.id});
            expect(mockInsert.mock.calls[0][1]).toEqual(new Simulation().tablename);
        } catch (e) {
            console.log(e.stack);
            done.fail();
        } finally {
            done();
        }
    }
    test();
});

test("Simulation successfully begins (sets turn_number to 0)", done => {
    async function test() {
        try {
            let simulation = await new Simulation().fromJsonObject({id: mockId});
            await simulation.begin_sim(user1);
            expect(mockInsert).toHaveBeenCalledTimes(1);
            expect(mockInsert.mock.calls[0][0]).toEqual(instance_result);
            expect(mockInsert.mock.calls[0][1]).toEqual(new SimulationInstance().tablename);

            cursor_call_count += 1;
            await simulation.begin_sim(user2);
            expect(mockInsert).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
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
