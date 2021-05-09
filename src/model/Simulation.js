import { combinations } from "mathjs";
import SimObj from "./SimObj.js";
import SimulationInstance from "./SimulationInstance.js";
import StrictCsvWriter from "../util/StrictCsvWriter.js";
import ForbiddenError from "../exception/ForbiddenError.js";

export default class Simulation extends SimObj {
    tablename = "Simulation";

    async toJsonObject() {
        let obj = {
            name: this.name,
            facilitator: this.facilitator,
            id: this.id,
            facilitator: this.facilitator,
            response_timeout: this.response_timeout,
            prompt: this.prompt,
            responses: this.responses,
            round_count: this.round_count,
            user_count: this.user_count,
            resources: this.resources,

            user_resources: this.user_resources,
            start_text: this.start_text,
            end_text: this.end_text

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
        this.facilitator = user.id;
        this.start_text = "";
        this.end_text = "";
        let sim_id = await this.insert();
        return sim_id;
    };

     async GetAllSims(user){
        this.facilitator = user.id;
        let instances = await this.selectMany();
        return instances;
    }

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
    }

    /**
     * Writes the data dump csv
     * @param {model.User} user The user getting the data dump
     * @param {String} sim_id The id of the simulation to dump
     * @param {String} path The path of the written csv file
     */
    async data_dump(user, sim_id, path) {
        this.id = sim_id;
        await this.select();
        if (!(await this.modifyableBy(user))) {
            throw new ForbiddenError("This user does not have permissions to update this SimObj");
        }

        let columns = ["turn_number"];
        for(let resource of this.resources) {
            columns.push(resource.name);
        }
        for (let i = 0; i < this.user_count; i++) {
            columns.push(`player${i}_id`);
            columns.push(`player${i}_name`);
            columns.push(`player${i}_response`);
            for(let user_resource of this.user_resources) {
                columns.push(`player${i}_${user_resource.name}`);
            }
        }
        let writer = new StrictCsvWriter(columns, path);
        return new SimulationInstance()._data_dump(writer, sim_id);
    }

    // A Simulation can only be modified by it's owner
    async modifyableBy(user) {
        return user.id == this.facilitator;
    }
   
};
