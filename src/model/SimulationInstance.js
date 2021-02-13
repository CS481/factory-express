import SimObj from "./SimObj.js";
import State from "./State.js"

export default class SimulationInstance extends SimObj {
    tablename = "SimulationInstances";

    async toJsonObject() {
        return {
            players: this.players,
            responses: this.responses,
            deadline: this.deadline,
            turn_number: this.turn_number,
            resources: this.resources
        }
    }

    async fromJsonObject(jsonObj) {
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
        this.user = user;
        this.response = response;

        await this.insert();
    }

    /** Gets the current turn ffor the selected user
     * @param  {model.User} user The user whos turn it is
     * @param  {String} simID The id of the simulation
     * @returns {Int} curTurn_number Turn_number Returns the current turn_number
     */
    async getCurrentTurn(user, simID) {
        this.simID = simID;
        // make array containing the user. Mongo should search for it. 
        this.players =  user;
        await this.select();

        return this.turn_number;
    }

    /** Sets the turn_number round to 0 to begin the existing simulation
    *   @param {model.User} user The user to begin the simulation
    */ 
    async begin_sim(user) {
        // make arrray containing the user. Mongo should search for it. 

        this.players =  user;
        await this.select();
        
        this.turn_number = 0;

        await this.update(this.user);
    }
}