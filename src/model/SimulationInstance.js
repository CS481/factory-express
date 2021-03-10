import SimObj from "./SimObj.js";
import State from "./State.js"
import StateHistory from "./StateHistory.js";
// import User from "./User.js";
// import UserHistory from "./UserHistory.js";

export default class SimulationInstance extends SimObj {
    tablename = "SimulationInstances";

    async toJsonObject() {
        let obj = {
            simulation: this.simulation,
            player_responses: this.player_responses,
            deadline: this.deadline,
            turn_number: this.turn_number,
            resources: this.resources,
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
        // this.player_responses = [new UserHistory()];
        // this.player_responses[0].user = user.id;
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
        
        let simInst = new SimulationInstance();
        await simInst.fromJsonObject(await this.toJsonObject());
        // Need to check the player_response[] to find the user param
        // Problem:: Array not creatred yet. will creating the array here make a new one everytime?
        // After this, how would i make sure it is being inserted under correct user?
        //  Would need to find the index of the specified user (i think)
        //      int user_index = this.player_responses.indexOf(user)???
        // if (simInst.player_responses.includes(user)) {
           simInst.player_responses = [{user: user, response: response}];
            this.player_responses = simInst.player_responses
            await this.insert();
        // } else {
        //     throw new console.error("This user is not a player for this sim instance");
        // }
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
        await simInst.fromJsonObject(await this.toJsonObject());
        // if (simInst.player_responses.includes(user)) {
        this.player_responses.user = user;
        await this.select();
        let curTurn = this.turn_number;
        return curTurn;
        // } else {
        //     throw new console.error("This user is not a player for this sim instance");
        // }
    }

    /** Sets the turn_number round to 0 to begin the existing simulation
    *   @param {model.User} user The user to begin the simulation
    */ 
    async begin_sim(user) {
        // make arrray containing the user. Mongo should search for it. 

        let simInst = new SimulationInstance();
        await simInst.fromJsonObject(await this.toJsonObject());
        // if (simInst.player_responses.includes(user)) {
            this.player_responses.user = user;
            await this.select();
            this.turn_number = 0;
            await this.update(user);
        // } else {
        //     throw new console.error("This user is not a player for this sim instance");
        // }
    }

    // A SimulationInstance can only be modified by it's owner
    // this one still does not recognize the user no matter what i do. 
    async modifyableBy(user) { 
        let simInst = new SimulationInstance();
        simInst = await this.toJsonObject();
        return simInst.player_responses.includes(user);
    }
}