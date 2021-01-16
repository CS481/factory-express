import SimObj from "./SimObj.js";

//TODO: Password encryption (bcrypt?)
export default class User extends SimObj {
    tablename = "users";

    toJsonObject() {
        return {username: this.username, password: this.password}
    }

    fromJsonObject(jsonObj) {
        this.username = jsonObj.username;
        this.password = jsonObj.password;
        this.id = jsonObj.id;
        return this;
    }
}