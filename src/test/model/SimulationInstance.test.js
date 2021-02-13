import * as MongoConn from "../../database/MongoConn.js";
import SimulationInstance from "../../model/SimulationInstance.js";
import User from "../../model/User.js"

// MongoConn mock
const MongoConnImpl = MongoConn.default; // Save the unmocked copy
const mockId = "1234";
const mockInsert = jest.fn(() => mockId);
const mockSelectResult = {color: "green", id: mockId};
const mockSelectOne = jest.fn(() => {return mockSelectResult});
const mockUpdate = jest.fn();
const mockReplace = jest.fn();
const mockDelete = jest.fn();
MongoConn.default = jest.fn(() => {
    return {
        insert: mockInsert,
        selectOne: mockSelectOne,
        update: mockUpdate,
        replace: mockReplace,
        delete: mockDelete
    }
});

const mockResponse = "yes";
const mock_user1 = new User();
mock_user1.username = "me";
mock_user1.password = "you";
const mock_user2 = new User();
mock_user2.username = "foo";
mock_user2.password = "bar";

const mock_players = [mock_user1, mock_user2];
const mock_responses = ["yes", "no"];
const mock_deadline = 10;
const mock_turnNumber = 5;

beforeEach(() => {
    mockInsert.mockClear();
});

afterAll(() => {
    // Unmock SimObj
    MongoConn.default = MongoConnImpl;
});


test("SimulationInstance successfully submits user response", done => {
    async function test() {
        try {
            let simInstanceTest = new SimulationInstance();
            await simInstanceTest.fromJsonObject({users: mock_players, responses: mock_responses, deadline: mock_deadline, turn_number: mock_turnNumber});
            await simInstanceTest.submit_response(mock_user1, mockResponse);
            expect(mockInsert).toHaveBeenCalledTimes(1);
            expect(mockInsert).toEqual("yes");
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
            await simInstanceTest.fromJsonObject({users: mock_players, responses: mock_responses, deadline: mock_deadline, turn_number: mock_turnNumber});
            await currentTurn.getCurrentTurn(mock_user1, mockId);
            expect(currentTurn.turn_number).toEqual(5);
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
            await simInstanceTest.fromJsonObject({users: mock_players, responses: mock_responses, deadline: mock_deadline, turn_number: mock_turnNumber});
            await currentTurn.begin_sim(mock_user1);
            expect(currentTurn.turn_number).toEqual(0);
        }  catch (e) {
            console.log(e.stack);
            done.fail();
        } finally {
            done();
        }
    }
    test();
});
