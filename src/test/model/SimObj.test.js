import * as MongoConn from "../../database/MongoConn.js";
import SimObj from "../../model/SimObj.js";

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

// A simple implementation of SimObj to test with
const childJsonObject = {color: "yellow"};
const childTablename = "SimObjChild";
class SimObjChild extends SimObj {
    tablename = childTablename;

    async modifyableBy(user) {
        return user.canModify;
    }

    toJsonObject() {
        return childJsonObject;
    }

    fromJsonObject(object) {
        this.data = object;
    }
}

// Users
const userCanModify = {canModify: true};
const userCannotModify = {canModify: false};

beforeEach(() => {
    mockInsert.mockClear();
    mockSelectOne.mockClear();
    mockUpdate.mockClear();
    mockReplace.mockClear();
    mockDelete.mockClear();
});

afterAll(() => {
    // Unmock MongoConn
    MongoConn.default = MongoConnImpl;
});

test("SimObj successfully inserts into database", done => {
    async function test() {
        try {
            await new SimObjChild().insert();
            expect(mockInsert).toHaveBeenCalledTimes(1);
            expect(mockInsert.mock.calls[0][0]).toEqual(childJsonObject);
            expect(mockInsert.mock.calls[0][1]).toEqual(childTablename);
        } finally {
            done();
        }
    }
    test();
});

test("SimObj successfully selects from database", done => {
    async function test() {
        try {
            let result = new SimObjChild();
            await result.select();
            expect(mockSelectOne).toHaveBeenCalledTimes(1);
            expect(mockSelectOne.mock.calls[0][0]).toEqual(childJsonObject);
            expect(mockSelectOne.mock.calls[0][1]).toEqual(childTablename);
            expect(result.data).toEqual(mockSelectResult);
        } finally {
            done();
        }
    }
    test();
});

test("SimObj successfully updates in database", done => {
    async function test() {
        try {
            let result = new SimObjChild();
            result.id = mockId;
            await result.update(userCanModify);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(mockUpdate.mock.calls[0][0]).toEqual({id: mockId});
            expect(mockUpdate.mock.calls[0][1]).toEqual(childJsonObject);
            expect(mockUpdate.mock.calls[0][2]).toEqual(childTablename);
            await expect(result.update(userCannotModify)).rejects.toThrow(Error);
        } finally {
            done();
        }
    }
    test();
});

test("SimObj successfully replaces in database", done => {
    async function test() {
        try {
            let result = new SimObjChild();
            result.id = mockId;
            await result.replace(userCanModify);
            expect(mockReplace).toHaveBeenCalledTimes(1);
            expect(mockReplace.mock.calls[0][0]).toEqual({id: mockId});
            expect(mockReplace.mock.calls[0][1]).toEqual(childJsonObject);
            expect(mockReplace.mock.calls[0][2]).toEqual(childTablename);
            await expect(result.replace(userCannotModify)).rejects.toThrow(Error);
        } finally {
            done();
        }
    }
    test();
});

test("SimObj successfully deletes from database", done => {
    async function test() {
        try {
            // Need to insert an obj before deleting it. 
            let result = new SimObjChild();
            await result.insert();
            expect(mockInsert).toHaveBeenCalledTimes(1);
            expect(mockInsert.mock.calls[0][0]).toEqual(childJsonObject);
            expect(mockInsert.mock.calls[0][1]).toEqual(childTablename);

            // Now attempt to delete the entry.
            await result.delete(userCanModify);
            expect(mockDelete).toHaveBeenCalledTimes(1);
            expect(mockDelete.mock.calls[0][0]).toEqual({id: mockId});
            expect(mockDelete.mock.calls[0][1]).toEqual(childJsonObject);
            expect(mockDelete.mock.calls[0][2]).toEqual(childTablename);

            /*  TODO: check that the entry was deleted. 
            *   THis would require making another select, but not using (or creating a new) the set mock for select. 
            *   THe current mockSelectOne mocks the selection to be {"color": "green", "id": "1234"}
            */

            await expect(result.delete(userCannotModify)).rejects.toThrow(Error);
        } finally {
            done();
        }
    }
    test();
});
