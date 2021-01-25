import SimObj from "./SimObj.js";
import User from "./User.js";
import MongoConn from "./MongoConn.js";

export default class SimulationInstance extends SimObj {
    /**Constructor for creating SimInstances
     * @param  {model.User[]} players The users that are playing the simulation
     * @param  {model.User[]} responses The responses of the players
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

    conn = new MongoConn();

    // Need to import State once implemented
    /** Get the staate of the Simulaiton
     * @returns {model.State} Returns the state of the simulaiton
     */ 
    async GetState() { 
        return this.State;
    }

    /** Submits the user response
     * @param  {model.User} user
     * @param  {String} string
     */
    async submit_response(user, string) {
        simInst = new SimulationInstance();
        tablename = "";

        simInst.user = user;
        simInst.string = string;

        //need to insert the user and resonse to the DB
        //not sure of correct tbale name, hence init at the begining
        this.insert(simInst.user, this.tablename);
    }

    /** Gets the current turn ffor the selected user
     * @param  {model.User} user The user whos turn it is
     * @returns {model.SimulationInstance} Returns the current turn_number
     */
    static async getCurrentTurn(user) {
        simInst = new SimulationInstance();
        simInst.user = user;
        
        return this.turn_number;
    }
}