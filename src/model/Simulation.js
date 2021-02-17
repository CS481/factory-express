import SimObj from "./SimObj.js";
import Frame from "./Frame.js";

export default class Simulation extends SimObj {
    tablename = "Simulation";

    async toJsonObject() {
        return {
            user: this.user,
            name: this.name,
            response_timeout: this.response_timeout,
            resources: this.resources
        }
    }

    async fromJsonObject(jsonObj) {
        this.id = jsonObj.id;
        this.user = jsonObj.user;
        this.name = jsonObj.name;
        this.response_timeout = jsonObj.response_timeout; //fetched from db or set 
        this.resources = jsonObj.resources;
        return this;
    }

    /**  Initialize a sim and return its ID
    *   @param {model.User} user The user creating this simulation
    *   @returns {String} the id of the new simulaiton
    */
    async init_sim(user) {
        this.user = user.id;
        let sim_id = await this.insert();

        let frame = new Frame();
        let frame_id = await frame.init_frame(user, sim_id);
        
        let default_end_frame =  {
            prompt: 'This simulation has ended. Thank you for your participation.', 
            rounds: [-1], 
            responses: [],
            id: frame_id,
            user: user.id
        };
        await frame.modify_frame(user, default_end_frame);
        return sim_id;
    };


    /** Modifies an existing simulation
    *   @param {model.User} The user to modify the frame
    *   @param {Object} sim_data is the new data to update the simulation with
    *   @param {String} sim_id is the id of the simulation to modifiy
    */
    async modify_sim(user, sim_data) {
        this.fromJsonObject(sim_data)
        await this.replace(user);
    };

    // A Simulation can only be modified by it's owner
    async modifyableBy(user) { 
        return user.id == this.user;
    }
};