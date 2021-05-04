import Resource from "./Resource.js";
import SimObj from "./SimObj.js";
import Simulation from "./Simulation.js";
import State from "./State.js"
import StateHistory from "./StateHistory.js";
import User from "./User.js";
import BadRequestError from "../exception/BadRequestError.js";
 
export default class SimulationInstance extends SimObj {
    tablename = "SimulationInstances";

    async toJsonObject() {
        let obj = {
            simulation: this.simulation,
            deadline: this.deadline,
            turn_number: this.turn_number,
            resources: this.resources,
            player_responses: this.player_responses,
            user_count: this.user_count
        };
        Object.keys(obj).map((key, _) => {
            if (obj[key] == undefined) {
                delete obj[key];
            }
        });
        return obj;
    }

    /** Get the state of the Simulation
     * @returns {model.State} Returns the state of the simulaiton
     */ 
    async getState(user, simulation_id) {
        this.simulation = simulation_id;
        let instances = await this.selectMany();
        // Sort the instances in reverse order of the turn numbers
        instances.sort((lhs, rhs) => rhs.turn_number - lhs.turn_number);
        let state =  new State();
        await state.fromJsonObject(instances[0]);
        state.user_id = user.id;
        state.history = await Promise.all(instances.map(async instance => {
            let sim_instance = await new SimulationInstance().fromJsonObject(instance);
            return sim_instance.getStateHistory();
        }));

        // Set state.user_waiting
        let simulation = await new Simulation().fromJsonObject({id: this.simulation});
        await simulation.select();
        if (instances[0].user_count < simulation.user_count) {
            state.user_waiting = true;
        } else {
            state.history[0].user_history.forEach(u_his => {
                if (u_his.user == user.id) {
                    state.user_waiting = u_his.response != "";
                }
            });
        }
        console.log(state.user_waiting);
        return state;
    }

    /**
     * Get the StateHistory object that represents this SimulationInstance
     * @returns {model.StateHistory}
     */
    async getStateHistory() {
        let state_history = new StateHistory();
        await state_history.fromJsonObject(await this.toJsonObject());
        return state_history;
    }

    /** Submits the user response
     * @param  {model.User} user
     * @param  {String} string
     * @param  {simulation_id}
     */
    async submit_response(user, response, simulation_id) {
        /*  TODO: 
        *   Verify both players have responded, 
        *   submit the response, update the state. 
        * 
        *   If both players have not responded.....BREAK
        */
        this.simulation = simulation_id;

        // console.log(JSON.parse(JSON.stringify(this.simulation)));
        
        //need to find where one of the users is user param
        this.player_responses = {"$elemMatch": {user: user.id}};
        
        // console.log(JSON.parse(JSON.stringify(this.player_responses)));
        // Select the one with the highest turn number
        let instances = await this.selectMany();

        //console.log(JSON.parse(JSON.stringify(instances)));

        // Sort the instances in reverse order of the turn numbers
        instances.sort((lhs, rhs) => rhs.turn_number - lhs.turn_number);

        // select the one with the highest turn number
        await this.fromJsonObject(instances[0]);

        let sim = new Simulation();
        sim.id = simulation_id;
        await sim.select();
        await sim.fromJsonObject(sim);
        // console.log(sim);
        // DO not Submit if less than expected # of users in Sim. 
        if (this.user_count != sim.user_count) {
            throw new BadRequestError("Not enough Users");
        };

        // Find the index in the array of the user submitting the response. 
        let user_index = 0;

        for (let F = 0; F < this.player_responses.length; F++) {
            // Find the index where the player is in the response array.
            // player_responses[F].user  = user
            if (this.player_responses[F].user == user.id) {
                user_index = F;
                break;
            }
        }
        // console.log(user_index);

        this.player_responses[user_index].response = response;
        // console.log(JSON.parse(JSON.stringify(this.player_responses[user_index].response)));
        
        // does not actually Update
        await this.update(user);
    
        // Doing for Each was confusing me a bit on how to do a fxn inside of it 
        // I will iterate over array for now. 
        for (let x = 0; x < this.player_responses.length; x++) {

            // Check for null Users or null / empty reponses
            if (this.player_responses[x].user == null 
                || this.player_responses[x].response == null
                || this.player_responses[x].response == "") {
                    // If there is a null value. 
                    // need to exit out and deal with it. 
                    break;
            };

            if (x == this.player_responses.length - 1) {
                // update resources
                let sim = new Simulation();
                sim.id = simulation_id;
                await sim.select();

                for (let y = 0; y < sim.resources.length; y++) {
                    let res = new Resource();
                    await res.fromJsonObject(sim.resources[y]);
                    this.resources[sim.resources[y].name] = await res.runEquation(await this.getStateHistory());
                }            
                
                for (let z = 0; z < sim.user_resources.length; z++) {

                    let res = new Resource();
                    await res.fromJsonObject(sim.user_resources[z]);

                    for (let i = 0; i < sim.user_count; i++){
                        this.player_responses[i].resources[res.name] = 
                            await res.runUserEquation(await this.getStateHistory(), this.player_responses[i].user);
                    }
                }     

                // need to update current instance before creating new one. 
                await this.update(user);

                // If get to the end of the array with no issues
                // Create new sim instance and increment the turn counter
                let new_Instance = new SimulationInstance();
                await new_Instance.fromJsonObject(await this.toJsonObject());
                new_Instance.turn_number++;

                
                for (let j = 0; j < this.player_responses.length; j++) {
                    // resetting all of the responses
                    new_Instance.player_responses[j].response = "";
                }                
                
                await new_Instance.insert();               
                
            }
        };
    }

    /** Gets the current turn ffor the selected user
     * @param  {model.User} user The user whos turn it is
     * @param  {String} simID The id of the simulation
     * @returns {Int} curTurn_number Turn_number Returns the current turn_number
     */
    async getCurrentTurn(user, simID) {
        this.sim_id = simID;
        // make array containing the user. Mongo should search for it. 
        let simInst = new SimulationInstance();
        simInst = await this.fromJsonObject(await this.toJsonObject());
        if (simInst.player_responses.includes(user)) {
            await this.select();
            let curTurn = this.turn_number;
            return curTurn;
        } else {
            throw new BadRequestError("This user is not a player for this sim instance");
        }
    }

    /** Sets the turn_number round to 0 to begin the existing simulation
    * @param {model.User} user The user to begin the simulation
    * @param {model.Simulation} simulation The simulation to create this instance from
    * @returns {string} The id of the sim instance
    */ 
    async begin_sim(user, simulation) {
        this.user_count = {"$lt": simulation.user_count};
        let instances = await this.selectMany();
        if (await instances.length == 0) {
            return await this._new_sim_instance(user, simulation);
        } else {
            await instances[0]._add_to_sim_instance(user, simulation);
            return this.id;
        }
    }

    // A SimulationInstance can only be modified by it's owner
    async modifyableBy(user) {
        let modifyable = false;
        this.player_responses.forEach(response => {
            modifyable = modifyable || response.user == user.id;
        });
        return modifyable;
    }

    /**
     * Add a new sim_instance to the database
     * @param {model.User} user The user to add to the new sim_instance
     * @param {model.Simulation} simulation The simulation the new entry is an instance of
     * @returns {string} The id of the new sim_instance
     */
    async _new_sim_instance(user, simulation) {
        this.resources = {};
        simulation.resources.forEach(resource => {
            this.resources[resource.name] = resource.starting_value;
        });
        this.turn_number = 0;
        this.deadline = "2018-11-13T20:20:39+00:00";
        this.player_responses = [];
        this.user_count = 0;
        this._add_new_user(user, simulation);
        return this.insert();
    }

    /**
     * Add the current user to an exising sim_instance
     * @param {model.User} user The user to add to the sim_instance
     * @param {model.Simulation} simulation The simulation this object is an instance of
     */
    async _add_to_sim_instance(user, simulation) {
        this._add_new_user(user, simulation);
        return this.update(user);
    }

    /**
     * Populate the user_resources of this simulation
     * @param {model.User} user The new user to add to this simulation 
     * @param {model.Simulation} simulation The simulation this object is an instance of
     */
    _add_new_user(user, simulation) {
        let new_history = {user: user.id, resources: {}, response: ""};
        simulation.user_resources.forEach(resource => {
            new_history.resources[resource.name] = resource.starting_value; 
        });
        this.user_count++;
        this.player_responses.push(new_history);
    }

    /**
     * Dump the data of all simulationinstances with a specific simulationid
     * @param {util.StrictCsvWriter} writer The csvWriter object
     * @param {String} sim_id The id of the simulation to get data dumps for
     */
    async _data_dump(writer, sim_id) {
        this.simulation = sim_id;
        let instances = await this.selectMany();
        await this.select();
        let usernames = {undefined: "undefined"};
        for await(let instance of instances) {
            usernames = await instance._write_to_csv(writer, usernames);
        }
    }

    /**
     * Write this specific simulationinstance's data to the csv
     * @param {util.StrictCsvWriter} writer The csvWriter object
     * @param {Object} usernames Cache of dict that maps user ids to their usernames
     */
    async _write_to_csv(writer, usernames) {
        let records = {turn_number: this.turn_number};
        for(let resource of Object.keys(this.resources)) {
            records[resource] = this.resources[resource];
        }
        for(let i = 0; i < this.user_count; i++) {
            let player_response = this.player_responses[i];
            let key = `player${i}`;
            if(!(player_response.user in usernames)) {
                let user = new User();
                await user.get_by_id(player_response.user);
                usernames[player_response.user] = user.username;
            }
            records[`${key}_id`] = player_response.user;
            records[`${key}_name`] = usernames[player_response.user];
            records[`${key}_response`] = player_response.response;
            for(let user_resource of Object.keys(player_response.resources)) {
                records[`${key}_${user_resource}`] = player_response.resources[user_resource];
            }
        }
        try {
            await writer.write(records);
        } catch (e) {
            console.log(`Error adding entry: ${e}`);
        }
        return usernames;
    }
}
