import * as MongoConn from "../../database/MongoConn.js";
import Simulation from "../../model/Simulation.js";
import User from "../../model/User.js";
import Frame from "../../model/Frame.js";

// MongoConn mock
const MongoConnImpl = MongoConn.default; // Save the unmocked copy
const mockId = "1234";
const mockInsert = jest.fn(() => mockId);
const mockReplace = jest.fn();
const mockDelete = jest.fn();
MongoConn.default = jest.fn(() => {
    return {
        insert: mockInsert,
        replace: mockReplace,
        delete: mockDelete
    }
});

const user1 = new User();
user1.id = "Can modify";
const user2 = new User();
user2.id = "Cannot modify";
const mockSim = new Simulation();
const mock_data = {id: mockId, user: user1.id, prompt: "test prompt", rounds: [0], effects: [[0]], responses: "do stuff", simulation: "0"}
const expected_data = {user: user1.id, prompt: "test prompt", rounds: [0], effects: [[0]], responses: "do stuff", simulation: "0"}

beforeEach(() => {
    mockInsert.mockClear();
    mockReplace.mockClear();
    mockDelete.mockClear();
});

afterAll(() => {
    // Unmock SimObj
    MongoConn.default = MongoConnImpl;
});


test("Frame successfully initiates and returns frame_id", done => {
    async function test() {
        try {
            let testFrame = new Frame();
            await testFrame.init_frame(user1, mockId);
            expect(mockInsert).toHaveBeenCalledTimes(1);
            await expect(new Frame().init_frame(user2, mockId)).rejects.toThrow(Error);
        } catch (e) {
            console.log(e.stack);
            done.fail();
        } finally {
            done();
        }
    }
    test();
});

test("Frame successfully modifies a frame", done => {
    async function test() {
        try {
            await new Frame().modify_frame(user1, mock_data);
            expect(mockReplace).toHaveBeenCalledTimes(1);
            expect(mockReplace.mock.calls[0][0]).toEqual({id: mockId});
            expect(mockReplace.mock.calls[0][1]).toEqual(expected_data);
            await expect(new Frame().modify_frame(user2, mock_data)).rejects.toThrow(Error);
        } catch (e) {
            console.log(e.stack);
            done.fail();
        } finally {
            done();
        }
    }
    test();
});

test("Frame successfully deletes a frame", done => {
    async function test() {
        try {
            await new Frame().delete(user1, mockId);
            expect(mockDelete).toHaveBeenCalledTimes(1);
            expect(mockDelete.mock.calls[0][0]).toEqual({id: mockId});
            await expect(new Frame().delete_frame(user2, mockId)).rejects.toThrow(Error);
        } finally {
            done();
        }
    }
    test();
});
