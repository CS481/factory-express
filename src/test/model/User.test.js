import * as MongoConn from "../../database/MongoConn.js";
import User from "../../model/User.js";
import bcrypt from "bcryptjs";

// MongoConn mock
const MongoConnImpl = MongoConn.default; // Save the unmocked copy
const mockId = "1234";
const mockInsert = jest.fn(() => mockId);
const expectedPassword = "hello";
const mockSelectResult = {id: mockId, username: "me", password: "$2b$08$ggzLynun843Mr7FI.x66LewtyE32GhU9akRjYSXMvoIKRp0ZWAWJe"};
const mockSelectOne = jest.fn(() => {return mockSelectResult});
const mockUpdate = jest.fn();
const mockReplace = jest.fn();
MongoConn.default = jest.fn(() => {
    return {
        insert: mockInsert,
        selectOne: mockSelectOne,
        update: mockUpdate,
        replace: mockReplace
    }
});

beforeEach(() => {
    mockInsert.mockClear();
    mockSelectOne.mockClear();
    mockUpdate.mockClear();
    mockReplace.mockClear();
});

afterAll(() => {
    // Unmock MongoConn
    MongoConn.default = MongoConnImpl;
});

test("A User can only be modified by itself", done => {
    async function test() {
        try {
            let user1 = new User();
            let user2 = new User();
            let user3 = new User();

            user1.id = "same";
            user2.id = "same";
            user3.id = "different";

            let sameUser = user1.modifyableBy(user1);
            let sameId = user1.modifyableBy(user2);
            let differentUser = user1.modifyableBy(user3);

            expect(await sameUser).toBe(true);
            expect(await sameId).toBe(true);
            expect(await differentUser).toBe(false);
        } finally {
            done();
        }
    };
    test();
});

test("A user must present correct credentials to login", done => {
    async function test() {
        try {
            let user1 = new User();
            await user1.fromJsonObject({username: "me", password: expectedPassword});
            expect(user1.id).toEqual(mockId);

            await expect(user1.fromJsonObject({username: "me", password: "you"})).rejects.toThrow(Error);
        } finally {
            done();
        }
    };
    test();
});

test("A user can sign up", done => {
    async function test() {
        try {
            let user1 = await User.SignUp({username: "me", password: expectedPassword});
            expect(user1.id).toEqual(mockId);
            expect(mockInsert.mock.calls[0][0].username).toEqual("me");
            expect(mockInsert.mock.calls[0][1].password == expectedPassword).toBe(false);
        } finally {
            done();
        }
    };
    test();
});

