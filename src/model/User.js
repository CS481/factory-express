import SimObj from "./SimObj.js";
import DBConnFactory from "../database/DBConnFactory.js";
import bcrypt from "bcryptjs";
import UnauthorizedError from "../exception/UnauthorizedError.js"
import ForbiddenError from "../exception/ForbiddenError.js";

//TODO: Password encryption (bcrypt?)
export default class User extends SimObj {
    tablename = "users";
    authenticated = false;

    /**
     * Sign up a new user
     * In order to use this function, the current user must be an authenticated admin
     * @param {Object} userObj The object containing the username and password of the new user
     */
    async SignUp(userObj) {
        if (this.role != "admin") {
            throw new ForbiddenError("This user does not have permissions to create new accounts");
        }

        let user = new User();
        user.username = userObj.username;
        user.password = userObj.password; // No need to enforce restrictions; we can rely on the schema for that
        user.role = "participant";
        user.id = await user.insert(user);
        return user;
    }

    async toJsonObject() {
        return {
            username: this.username
        }
    }

    async fromJsonObject(jsonObj) {
        this.username = jsonObj.username;
        this.password = jsonObj.password;
        await this.select();
        return this;
    }

    /**
     * Populate this user with fields selected from the database
     * @param {Object} dbRecord The record fetched from the database
     */
    async fromDatabaseRecord(dbRecord) {
        if (await bcrypt.compare(this.password, dbRecord.password)) {
            // User successfully authenticated, set any other information here
            this.id = dbRecord.id;
            this.role = dbRecord.role;
        } else {
            throw new UnauthorizedError("User not authenticated");
        }
    }

    /**
     * Returns a json object that can be stored in the database
     */
    async toDatabaseRecord() {
        let record = await this.toJsonObject();
        record.password = await bcrypt.hash(this.password, (Number)(process.env.BCRYPT_ROUNDS));
        record.role = this.role;
        return record;
    }

    /**
     * Override the select() function of SimObj
     */
    async select() {
        let conn = DBConnFactory();
        let result = await conn.selectOne(await this.toJsonObject(), this.tablename);
        if (result == null) {
            throw new Error("The requested SimObj cannot be found in the database");
        }
        await this.fromDatabaseRecord(result);
    }

    /**
     * Fetches a user by id, useful for getting the username of an arbitrary user
     * @param {String} id The id of the user to fetch
     */
    async get_by_id(id) {
        let conn = DBConnFactory();
        let result = await conn.selectOne({id: id}, this.tablename);
        if (result == null) {
            throw new Error(`The requested SimObj with id ${id} cannot be found in the database`);
        }
        await super.fromJsonObject(result);
    }

    /**
     * Override the insert() function of SimObj
     */
    async insert() {
        if (this.id != undefined) {
            throw new Error(`Cannot insert new SimObj because id already set to ${this.id}`);
        }
        let conn = DBConnFactory();
        this.id = await conn.insert(await this.toDatabaseRecord(), this.tablename);
        return this.id;
    }

    /**
     * Override the update() function of SimObj
     */
    async update(user) {
        if (!(await this.modifyableBy(user))) {
            throw new Error("This user does not have permissions to update this SimObj");
        }
        let conn = DBConnFactory();
        conn.update({id: this.id}, await this.toDatabaseRecord(), this.tablename);
    }

    /**
     * Override the replace() function of SimObj
     */
    async replace(user) {
        if (!(await this.modifyableBy(user))) {
            throw new Error("This user does not have permissions to update this SimObj");
        }
        let conn = DBConnFactory();
        conn.replace({id: this.id}, await this.toDatabaseRecord(), this.tablename);
    }
     /**
     *  Allows for Role changes
     */
    async RoleUpdate(user, roledata) {
        this.role = roledata.role;
        await this.replace(user);
    }

    /**
     * Override the modifyableBy() function of SimObj
     * A user is only modifyable by itself
     */
    async modifyableBy(user) { 
        return user.id == this.id;
    }
}
