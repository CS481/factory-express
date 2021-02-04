import Simulation from "../../model/Simulation.js";
import {jest} from "@jest/globals";
import User from "../../model/User.js";
import SimObj from "../../model/SimObj.js";
import Frame from "../../model/Frame.js";

const mock_user = new User();
mock_user.username = "me";
mock_user.password = "you";
const mockData = "prompt";
const mockSim = new Simulation();


// SimObj mock
const SimObjImpl = SimObj.default; // Save the unmocked copy
const mockId = "1234";
const mockInsert = jest.fn(() => mockId);
const mockUpdate = jest.fn(() => mock_user,  () => mockData, () => mockId);
const mockDelete = jest.fn(() => mock_user,  () => mockData, () => mockId);
SimObj.default = jest.fn(() => {
    return {
        init_frame: mockInsert,
        modify_frame: mockUpdate,
        delete_frame: mockDelete,
    }
});

// A simple implementation of SimObj to test with
const childJsonObject = {color: "yellow"};
const childTablename = "SimObjChild";


// Users
const userCanModify = {canModify: true};
const userCannotModify = {canModify: false};

beforeEach(() => {
    mockInsert.mockClear();
    mockUpdate.mockClear();
    mockDelete.mockClear();
});

afterAll(() => {
    // Unmock SimObj
    SimObj.default = SimObjImpl;
});


test("Frame successfully initiates and returns frame_id", done => {
    async function test() {
        try {
            let testFrame = new Frame(mock_user, mockSim, "test Prompt", ["first", "second"], [1,2,3]);
            await testFrame.init_frame(userCanModify, mockId);
            expect(mockInsert).toHaveBeenCalledTimes(1);
            expect(mockInsert.mock.calls[0][0]).toEqual(childJsonObject);
            expect(mockInsert.mock.calls[0][1]).toEqual(childTablename);
            expect(mockInsert).toEqual(mockId);
        } finally {
            done();
        }
    }
    test();
});

test("Frame successfully modifies a frame", done => {
    async function test() {
        try {
            let testFrame = new Frame(mock_user, mockSim, "test Prompt", ["first", "second"], [1,2,3]);
            await testFrame.modify_frame(userCanModify, mockData, mockId);
            expect(mockUpdate.mock.calls[0][0]).toEqual({id: mockId});
            expect(mockUpdate.mock.calls[0][1]).toEqual(childJsonObject);
            expect(mockUpdate.mock.calls[0][2]).toEqual(childTablename);
            await expect(testFrame.modify_frame(userCannotModify)).rejects.toThrow(Error);
        } finally {
            done();
        }
    }
    test();
});

test("Frame successfully deletes a frame", done => {
    async function test() {
        try {
            let testFrame = new Frame(mock_user, mockSim, "test Prompt", ["first", "second"], [1,2,3]);
            await testFrame.delete_frame(userCanModify, mockData, mockId);
            expect(mockDelete.mock.calls[0][0]).toEqual({id: mockId});
            expect(mockDelete.mock.calls[0][1]).tobeNull();
            expect(mockDelete.mock.calls[0][2]).tobeNull();
            await expect(testFrame.delete_frame(userCannotModify)).rejects.toThrow(Error);
        } finally {
            done();
        }
    }
    test();
});

