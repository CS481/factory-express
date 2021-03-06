import SimObj from "./SimObj.js";
import State from "./State.js"
import StateHistory from "./StateHistory.js";

export default class SimulationInstance extends SimObj {
    tablename = "SimulationInstances";

    async toJsonObject() {
        let obj = {
            simulation: this.simulation,
            players: this.players,
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

    // Need to import State once implemented
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
        state.history = await Promise.all(instances.map(async instance => {
            let sim_instance = await new SimulationInstance().fromJsonObject(instance);
            return sim_instance.getStateHistory();
        }));
        state.user_waiting = true;
        state.history[0].user_history.forEach(u_his => {
            // Set user_waiting to false if user_waiting is already false, or if this user has not submitted a response yet
            state.user_waiting = !(!state.user_waiting || (u_his.user == user.id && u_his.response == ""));
        });
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
     */
    async submit_response(user, response) {
        /* since we have an array of users (players), 
        *   we need to set the players to the array that contains the user 
        * Array.includes()
        *      Determines whether the array contains a value, returning true or false as appropriate.
        * 
        * if (players array includes user) {set this.players = playerrs array containing user}
        *    else {throw error that this user is not a player}
        */
        let simInst = new SimulationInstance();
        simInst = await this.toJsonObject();
        if (simInst.players.includes(user)) {
            this.response = response;
            await this.insert();
        } else {
            throw new console.error("This user is not a player for this sim instance");
        }
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
        simInst = await this.toJsonObject();
        if (simInst.players.includes(user)) {
            await this.select();
            let curTurn = simInst.turn_number;
            return curTurn;
        } else {
            throw new console.error("This user is not a player for this sim instance");
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
    // this one still does not recognize the user no matter what i do. 
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
        this.deadline = -1;
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
        let new_history = {user: user.id, resources: {}};
        simulation.user_resources.forEach(resource => {
            new_history.resources[resource.name] = resource.starting_value; 
        });
        this.user_count++;
        this.player_responses.push(new_history);
    }
}