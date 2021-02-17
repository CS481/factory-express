import SimObj from "./SimObj.js";
import State from "./State.js"

export default class SimulationInstance extends SimObj {
    tablename = "SimulationInstances";

    async toJsonObject() {
        return {
            simulation: this.simulation,
            players: this.players,
            responses: this.responses,
            deadline: this.deadline,
            turn_number: this.turn_number,
            resources: this.resources
        }
    }

    async fromJsonObject(jsonObj) {
        this.simulation = jsonObj.simulation;
        this.players = jsonObj.players;
        this.responses = jsonObj.responses;
        this.deadline = jsonObj.deadline;
        this.turn_number = jsonObj.turn_number;
        this.resources = jsonObj.resources;
        return this;
    }


    // Need to import State once implemented
    /** Get the state of the Simulation
     * @returns {model.State} Returns the state of the simulaiton
     */ 
    async getState() { 
        let state =  new State();
        this.state = state;
        return this.State;
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
    *   @param {model.User} user The user to begin the simulation
    */ 
    async begin_sim(user) {
        // make arrray containing the user. Mongo should search for it. 

        let simInst = new SimulationInstance();
        simInst = await this.toJsonObject();
        if (simInst.players.includes(user)) {
            simInst.turn_number = 0;
            this.turn_number = simInst.turn_number;
            await this.update(user);
        } else {
            throw new console.error("This user is not a player for this sim instance");
        }
    }

    // A SimulationInstance can only be modified by it's owner
    // this one still does not recognize the user no matter what i do. 
    async modifyableBy(user) { 
        let simInst = new SimulationInstance();
        simInst = await this.toJsonObject();
        return simInst.players.includes(user);
    }
}