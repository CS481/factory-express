import SimObj from "./SimObj.js";

export default class Frame extends SimObj {
    tablename = "Frame";

    async toJsonObject() {
        let obj = {
            user: this.user,
            simulation: this.simulation,
            prompt: this.prompt,
            effects: this.effects,
            responses: this.responses,
            rounds: this.rounds
        };
        Object.keys(obj).map((key, _) => {
            if (obj[key] == undefined) {
                delete obj[key];
            }
        });
        return obj;
    }

    /** Initialize a frame and return its ID
    *   @param {model.User} The user creating this Frame
    *   @param {String} sim_id the id of the sim being created
    *   @returns {String} the id of the new frame
    */
    async init_frame(user, sim_id) {
        this.user = user.id;
        this.simulation = sim_id;
        this.id = await this.insert();
        
        return this.id;
    }

    /** Modify a frame and replace its contents in DB
    *   @param {model.User} user The user modifying this Frame
    *   @param {Object} frame_data the object of the frame being modified
    *   @param {String} frame_id the id of the affected frame
    */
    async modify_frame(user, frame_data) {
        this.id = frame_data.id;
        await this.select();

        await this.fromJsonObject(frame_data);
        await this.replace(user);
    }

    /** Delete a frame 
    *   @param {model.User} user The user deleting this Frame
    *   @param {String} frame_id the id of the frame being deleted
    */
    async delete_frame(user, frame_id) {
        this.id = frame_id;
        await this.select();
        await this.delete(user);
    }

    // A frame can only be modified by it's owner
    async modifyableBy(user) {
        return user.id == this.user;
    }
}