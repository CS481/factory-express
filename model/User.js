import SimObj from "./SimObj.js";

//TODO: Password encryption (bcrypt?)
export default class User extends SimObj {
    tablename = "users";

    toJsonObject() {
        return {username: this.username, password: this.password}
    }

    static fromJsonObject(jsonObj) {
        let user = new User();
        user.username = jsonObj.username;
        user.password = jsonObj.password;
        user.id = jsonObj.id;
        return user;
    }
}