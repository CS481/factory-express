import SimObj from "./SimObj.js";
import User from "./User.js";
import MongoConn from "./MongoConn.js";

export default class Frame extends SimObj {
    
    conn = MongoConn();
    /**
     * @param  {model.User} owner The user that owns the frame
     * @param  {model.Simulation} simulation The simulation
     * @param  {String} prompt the prompt being presented in the Frame
     * @param  {String, Effect} effects The name and Effect of the effects that will occur in frame
     * @param  {String[]} responses The array of user responses
     * @param  {Int[]} rounds The array of rounds leading to current round
     * @returns {model.Frame} Returns an new instance of Frame
     */
    Frame (owner, simulation, prompt, effects, responses, rounds) {
        this.owner = owner;
        this.simulation = simulation;
        this.prompt = prompt;
        this.effects = effects;
        this.responses = responses;
        this.rounds = rounds;3
        return this;
    }

    /** Initialize a frame and return its ID
    *   @param {model.User} The user creating this Frame
    *   @param {String} sim_id the id of the sim being created
    *   @returns {String} the id of the new frame
    */
    async initialize_frame(user, sim_id) {
        this.user = user;
        new_frame.simulation_id = sim_id;
        frame_id = this.insert(Frames, new_frame);
        
        return frame_id;
    };

    /** Modify a frame and replace its contents in DB
    *   @param {model.User} user The user modifying this Frame
    *   @param {Object} frame_data the object of the frame being modified
    *   @param {String} frame_id the id of the affected frame
    */
    async modify_frames(user, frame_data, frame_id) {

        frameCon = new Frame();

        frame_query = this.selectOne('_id', frame_id);
        frame = this.selectOne('Frames', frame_query);       
        frame_data.simulation_id = frame.simulation_id;
        
        this.replace(frame_query, frame_data, 'Frames');

    }

    /** Delete a frame 
    *   @param {model.User} user The user deleting this Frame
    *   @param {Object} frame_data the object of the frame being deleted
    *   @param {String} frame_id the id of the frame being deleted
    */
    async delete_frames(user, frame_data, frame_id) {
        frameCon = new Frame();

        frame_query = this.selectOne('_id', frame_id);
        frame = this.selectOne('Frames', frame_query);       
        frame_data.simulation_id = frame.simulation_id;
        
        this.delete(frame_query, frame_data, 'Frames');
    }
}