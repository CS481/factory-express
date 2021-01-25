import SimObj from "./SimObj.js";
import User from "./User.js";
import MongoConn from "./MongoConn.js";

export default class Simulation extends SimObj {
    // Not sure about declarations since we obviously actaully WANT data. double-checking declarations
    // Constructor
   
    /** Constructor for Simulaiton instances
     * @param  {model.User} user The user creating this simulation
     * @param  {String} name The name of the simulation
     * @param  {Int} response_timeout The time a player has to answer the propmt
     * @param  {String, Float} resource The resources contained in the simulation
     * @returns {model.Simulation} Returns an new instance of a simulation
     */
    Simulation(user, name, response_timeout, resource) {
        this.user = user
        this.name = name;
        this.response_timeout = response_timeout; //fetched from db or set 
        this.resource = resource;
        return this;
    }

    conn = new MongoConn();

    /**  Initialize a sim and return its ID
    *   @param {model.User} user The user creating this simulation
    *   @returns {String} the id of the new simulaiton
    */
    static async initialize_sim(user) {

        sim = new Simulation();

        facilitator.username = user.username;
        
        sim_id = this.insert('Simulations', facilitator);
        frame_id = this.initialize_frame(user, sim_id);
        
        default_end_frame =  {
            prompt: 'This simulation has ended. Thank you for your participation.', 
            rounds: [-1], 
            responses: [] 
        } ;                        
        
        this.modify_frame(user, default_end_frame, frame_id);
        return sim_id;
    };


    /** Modifies an existing simulation
    *   @param {model.User} The user to modify the frame
    *   @param {Object} sim_data is the new data to update the simulation with
    *   @param {String} sim_id is the id of the simulation to modifiy
    */
    async modify_sim(user, sim_data, sim_id) {
        
       sim = new Simulation();
        
       /*  These may be set from the JSON POST data. Best to unset them just in case
        *   delete(frame_data.user);
        *   delete(frame_data.simulation_id);
        */
        
        // Some values cannot be allowed to change
        sim_data.username = user.username;
      
        this.replace({_id: sim_id}, sim_data, 'Simulations');
    };

    // May move to siminstance class
    
    /** Sets the initial round to 0 to begin the existing simulation
    *   @param {model.User} user The user to begin the simulation
    */ 
    async begin_sim(user) {
        sim = new Simulation();
        sim.rounds = [0];
        this.insert(sim.rounds, 'Simulations');
    }
};