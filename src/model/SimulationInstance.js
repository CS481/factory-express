import SimObj from "./SimObj.js";
import MongoConn from "../database/MongoConn.js";
import State from "./State.js"

export default class SimulationInstance extends SimObj {
    tablename = "";
    conn = new MongoConn();

    /**Constructor for creating SimInstances
     * @param  {model.User[]} players The users that are playing the simulation
     * @param  {String[]} responses The responses of the players
     * @param  {Int} deadline The deadline for the submission of responses by players
     * @param  {Int} turn_number The number of the current turn
     * @returns {model.SimulationInstance} Returns an new instance of SimulationInstance
T     */
    SimulationInstance(players, responses, deadline, turn_number, resources) {
        this.players = players;
        this.responses = responses;
        this.deadline = deadline;
        this.turn_number = turn_number;
        this.resources = resources;
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
        this.players =  {players: {$eleMatch: {user}}};
        await this.select();

        return this.turn_number;
    }

    /** Sets the turn_number round to 0 to begin the existing simulation
    *   @param {model.User} user The user to begin the simulation
    */ 
    async begin_sim(user) {
        // make arrray containing the user. Mongo should search for it. 

        this.players =  {players: {$eleMatch: {user}}};
        await this.select();
        
        this.turn_number = 0;

        await this.insert();
    }
}