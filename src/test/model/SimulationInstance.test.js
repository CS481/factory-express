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
const mock_sim_data = {id: mockId, user: user1.id, response_timeout: 0, resources: ["UwU"], name: "test sim"};
const mock_instance = {simulation: mockSim, players: [user1, user2], responses: ["oh", "no"], deadline: 10, turn_number: 5, resources: ["UwU"]};

// MongoConn mock
const MongoConnImpl = MongoConn.default; // Save the unmocked copy

const mockInsert = jest.fn(() => mockId);
const mockSelectResult = {user: user1, id: mockId};
const mockUpdate = jest.fn();
const mockSelectOne = jest.fn(() => mockSelectResult);
MongoConn.default = jest.fn(() => {
    return {
        insert: mockInsert,
        update: mockUpdate,
        selectOne: mockSelectOne,
    }
});


beforeEach(() => {
    mockInsert.mockClear();
    mockUpdate.mockClear();
    mockSelectOne.mockClear();
});

afterAll(() => {
    // Unmock SimObj
    MongoConn.default = MongoConnImpl;
});

test("SimulationInstance successfully submits user response", done => {
    async function test() {
        try {
            let simInstanceTest = new SimulationInstance();
            await simInstanceTest.fromJsonObject(mock_instance);
            await simInstanceTest.submit_response(user1, ["yes"]);
            expect(mockInsert).toHaveBeenCalledTimes(1);
        } catch (e) {
            console.log(e.stack);
            done.fail();
        } finally {
            done();
        }
    }
    test();
});

test("SimulationInstance successfully gets the current turn number for the user", done => {
    async function test() {
        try{
            let simInstanceTest = new SimulationInstance();
            await simInstanceTest.fromJsonObject(mock_instance);
            let curTurn = await simInstanceTest.getCurrentTurn(user1, mockId);
            expect(curTurn).toEqual(5);
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
            let simInstanceTest = new SimulationInstance();
            await simInstanceTest.fromJsonObject(mock_instance);
            await simInstanceTest.begin_sim(user1);
            let curTurn = await simInstanceTest.getCurrentTurn(user1, mockId);
            expect(curTurn).toEqual(0);
        }  catch (e) {
            console.log(e.stack);
            done.fail();
        } finally {
            done();
        }
    }
    test();
});
