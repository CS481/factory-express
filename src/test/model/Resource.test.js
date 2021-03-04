import Resource from "../../model/Resource.js";

const resource_json = {name: "stuff", starting_value: 500, equation: "mean(${stuff}, ${user0.things}, ${user1.things})"};
const user_resource_json = {name: "stuff", starting_value: 500, equation: "mean(${stuff}, ${user0.response}) + ${current_user.things}"};
const user1 = {id: "user1"};
const user2 = {id: "user2"};
const history = {
    resources: [{name: "stuff", value: 100}],
    user_history: [
        {name: 'things', user: user1.id, value: 20, response: 4},
        {name: 'things', user: user2.id, value: 30, response: 12},
        {name: 'not_used', user: user1.id, value: 0, response: 4},
        {name: 'not_used', user: user2.id, value: 0, response: 12}
    ]
};

beforeEach(() => {

});

test("Resource successfully calculates resource", done => {
    async function test() {
        try {
            let resource = new Resource();
            await resource.fromJsonObject(resource_json);
            expect(resource.runEquation(history)).toBe(50);
        } catch (e) {
            console.log(e.stack);
            done.fail();
        } finally {
            done();
        }
    }
    test();
});

test("Resource successfully calculates user_resource", done => {
    async function test() {
        try {
            let resource = new Resource();
            await resource.fromJsonObject(user_resource_json);
            expect(resource.runUserEquation(history, user1.id)).toBe(76);
            expect(resource.runUserEquation(history, user2.id)).toBe(82);
        } catch (e) {
            console.log(e.stack);
            done.fail();
        } finally {
            done();
        }
    }
    test();
});