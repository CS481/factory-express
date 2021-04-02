import SimObj from "./SimObj.js";
import SimulationInstance from "./SimulationInstance.js";

export default class Simulation extends SimObj {
    tablename = "Simulation";

    async toJsonObject() {
        let obj = {
            name: this.name,
            facilitator: this.user,
            id: this.id,
            name: this.name,
            response_timeout: this.response_timeout,
            prompt: this.prompt,
            responses: this.responses,
            round_count: this.round_count,
            user_count: this.user_count,
            resources: this.resources,
            user_resources: this.user_resources

        };
        Object.keys(obj).map((key, _) => {
            if (obj[key] == undefined) {
                delete obj[key];
            }
        });
        return obj;
    }

    /**  Initialize a sim and return its ID
    *   @param {model.User} user The user creating this simulation
    *   @returns {String} the id of the new simulaiton
    */
    async init_sim(user) {
        this.user = user.id;
        let sim_id = await this.insert();
        return sim_id;
    };

    /** Sets the turn_number round to 0 to begin the existing simulation
    * @param {model.User} user The user to begin the simulation
    * @returns {string} The id of the simulation instance this user is a part of
    */ 
    async begin_sim(user) {
        await this.select();
        let select_obj = await new SimulationInstance().fromJsonObject({simulation: this.id});
        return await select_obj.begin_sim(user, this);
    }

    /** Modifies an existing simulation
    *   @param {model.User} The user to modify the frame
    *   @param {Object} sim_data is the new data to update the simulation with
    *   @param {String} sim_id is the id of the simulation to modifiy
    */
    async modify_sim(user, sim_data) {
        this.id = sim_data.id;
        await this.select(); // Fetch the user id, so we can validate modifyableBy

        delete sim_data.user;
        this.fromJsonObject(sim_data);
        await this.replace(user);
    };

    // A Simulation can only be modified by it's owner
    async modifyableBy(user) {
        return user.id == this.user;
    }
};