import SimObj from "./SimObj.js";
import Frame from "./Frame.js";
import MongoConn from "../database/MongoConn.js";

export default class Simulation extends SimObj {
    
    tablename = "";
    conn = new MongoConn();

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


    /**  Initialize a sim and return its ID
    *   @param {model.User} user The user creating this simulation
    *   @returns {String} the id of the new simulaiton
    */
    async init_sim(user) {

        let sim = new Simulation();

        sim.username = user.username;

        let sim_id = sim.insert();

        let frame = new Frame();
        let frame_id = frame.init_frame(user, sim_id);
        
        let default_end_frame =  {
            prompt: 'This simulation has ended. Thank you for your participation.', 
            rounds: [-1], 
            responses: [] 
        } ;                        
        
        await frame.modify_frame(user, default_end_frame, frame_id);
        return sim_id;
    };


    /** Modifies an existing simulation
    *   @param {model.User} The user to modify the frame
    *   @param {Object} sim_data is the new data to update the simulation with
    *   @param {String} sim_id is the id of the simulation to modifiy
    */
    async modify_sim(user, sim_data, sim_id) {
        
       let sim = new Simulation();
       
       sim.sim_id = sim_id;
        
       /*  These may be set from the JSON POST data. Best to unset them just in case
        *   delete(frame_data.user);
        *   delete(frame_data.simulation_id);
        */
        
        // Some values cannot be allowed to change
        sim_data.username = user.username;
      
        await this.update(user);
    };
};