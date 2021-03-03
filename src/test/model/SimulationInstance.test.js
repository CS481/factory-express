import * as MongoConn from "../../database/MongoConn.js";
import Simulation from "../../model/Simulation.js";
import SimulationInstance from "../../model/SimulationInstance.js";
import User from "../../model/User.js"

const user1 = new User();
user1.id = "Can modify";
const user2 = new User();
user2.id = "Cannot modify";
const mockId = "1234";
const mockSim = new Simulation();
const mock_sim_data = {
    id: mockId,
    user: user1.id,
    response_timeout: -1,
    resources: [{name: "stuff", starting_value: "111"}],
    name: "test sim",
    responses: ["response1", "response2"],
    prompt: "This is a prompt!"
};

const mock_instance2 = {
    id: mockId,
    simulation: mockId,
    deadline: -1,
    turn_number: 2,
    resources: [{name: "stuff", value: "69420"}],
    player_responses: [
        {name: "things", user: "Can modify", value: "17", response: ""},
        {name: "things", user: "Cannot modify", value: "33", response: "response2"}
    ]
};
const mock_instance1 = {
    id: mockId,
    simulation: mockId,
    deadline: -1,
    turn_number: 1,
    resources: [{name: "stuff", value: "1337"}],
    player_responses: [
        {name: "things", user: "Can modify", value: "17", response: "response1"},
        {name: "things", user: "Cannot modify", value: "33", response: "response2"}
    ]
};

const expected_state = {
    turn_number: mock_instance2.turn_number,
    response_deadline: mock_instance2.deadline,
    prompt: mock_sim_data.prompt,
    user_waiting: false,
    responses: mock_sim_data.responses,
    history: [
        {resources: mock_instance2.resources, user_history: mock_instance2.player_responses},
        {resources: mock_instance1.resources, user_history: mock_instance1.player_responses}
    ]
}

// MongoConn mock
const MongoConnImpl = MongoConn.default; // Save the unmocked copy

const mockInsert = jest.fn(() => mockId);
const mockSelect = jest.fn(() => [mock_instance1, mock_instance2]);
const mockUpdate = jest.fn();
const mockSelectOne = jest.fn(() => mock_sim_data);

MongoConn.default = jest.fn(() => {
    return {
        insert: mockInsert,
        update: mockUpdate,
        selectOne: mockSelectOne,
        select: mockSelect
    }
});


beforeEach(() => {
    mockInsert.mockClear();
    mockUpdate.mockClear();
    mockSelectOne.mockClear();
    mockSelect.mockClear();
});

afterAll(() => {
    // Unmock SimObj
    MongoConn.default = MongoConnImpl;
});

// test("SimulationInstance successfully submits user response", done => {
//     async function test() {
//         try {
//             let simInstanceTest = new SimulationInstance();
//             await simInstanceTest.fromJsonObject(mock_instance);
//             await simInstanceTest.submit_response(user1, ["yes"]);
//             expect(mockInsert).toHaveBeenCalledTimes(1);
//         } catch (e) {
//             console.log(e.stack);
//             done.fail();
//         } finally {
//             done();
//         }
//     }
//     test();
// });

// test("SimulationInstance successfully gets the current turn number for the user", done => {
//     async function test() {
//         try{
//             let simInstanceTest = new SimulationInstance();
//             await simInstanceTest.fromJsonObject(mock_instance);
//             let curTurn = await simInstanceTest.getCurrentTurn(user1, mockId);
//             expect(curTurn).toEqual(5);
//         } catch (e) {
//             console.log(e.stack);
//             done.fail();
//         } finally {
//             done();
//         }
//     }
//     test();
// });

// test("Simulation successfully begins (sets turn_number to 0)", done => {
//     async function test() {
//         try {
//             let simInstanceTest = new SimulationInstance();
//             await simInstanceTest.fromJsonObject(mock_instance);
//             await simInstanceTest.begin_sim(user1);
//             let curTurn = await simInstanceTest.getCurrentTurn(user1, mockId);
//             expect(curTurn).toEqual(0);
//         } catch (e) {
//             console.log(e.stack);
//             done.fail();
//         } finally {
//             done();
//         }
//     }
//     test();
// });

test("SimulationInstance successfully returns current state", done => {
    async function test() {
        try {
            let sim_instance = new SimulationInstance();
            let state = await sim_instance.getState(user1, mockId);
            let state_json = await state.toJsonObject();
            expect(state_json).toEqual(expected_state);

            // Check that the user_waiting code works
            sim_instance = new SimulationInstance();
            state = await sim_instance.getState(user2, mockId);
            expect(state.user_waiting).toBeTruthy();
        } catch (e) {
            console.log(e.stack);
            done.fail();
        } finally {
            done();
        }
    }
    test();
});