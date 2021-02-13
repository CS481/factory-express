import Simulation from "../../model/Simulation.js";
import {jest} from "@jest/globals";
import User from "../../model/User.js";
import SimObj from "../../model/SimObj.js";

const mock_user = new User();
mock_user.username = "me";
mock_user.password = "you";
const mock_resource = {"air": 100};

// SimObj mock
const SimObjImpl = SimObj.default; // Save the unmocked copy
const mockId = "1234";
const mockInsert = jest.fn(() => mockId);
const mockUpdate = jest.fn(() => mock_user, () => mock_resource, () => mockId);
SimObj.default = jest.fn(() => {
    return {
        insert: mockInsert,
        update: mockUpdate,
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
});

afterAll(() => {
    // Unmock SimObj
    SimObj.default = SimObjImpl;
});


test("Simulation successfully initiates", done => {
    async function test() {
        try {
            let sim = new Simulation(mock_user, "test", 100, mock_resource);
            await sim.init_sim(mock_user);
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

test("Simulation successfully modifies", done => {
    async function test() {
        try {
            let result = new Simulation(mock_user, "test", 100, mock_resource);
            await result.modify_sim(userCanModify, mock_resource, mockId);
            expect(mockUpdate.mock.calls[0][0]).toEqual({id: mockId});
            expect(mockUpdate.mock.calls[0][1]).toEqual(childJsonObject);
            expect(mockUpdate.mock.calls[0][2]).toEqual(childTablename);
        } finally {
            done();
        }
    }
    test();
});



