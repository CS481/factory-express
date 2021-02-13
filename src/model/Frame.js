import SimObj from "./SimObj.js";

export default class Frame extends SimObj {
    
    tablename = "Frame";

    /** Constructor for creating Frames
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
        this.rounds = rounds;
        return this;
    }

    async toJsonObject() {
        return {
            owner: this.owner,
            simulation: this.simulation,
            prompt: this.prompt,
            effects: this.effects,
            responses: this.responses,
            rounds: this.rounds
        }
    }

    async fromJsonObject(jsonObj) {
        this.owner = jsonObj.owner;
        this.simulation = jsonObj.simulation;
        this.prompt = jsonObj.prompt;
        this.effects = jsonObj.effects;
        this.responses = jsonObj.responses;
        this.rounds = jsonObj.rounds;
        await this.select();
        return this;
    }

    /** Initialize a frame and return its ID
    *   @param {model.User} The user creating this Frame
    *   @param {String} sim_id the id of the sim being created
    *   @returns {String} the id of the new frame
    */
    async init_frame(user, sim_id) {

        this.user = user;

        this.simulation_id = sim_id;

        this.id = await this.insert();
        
        return this.id;
    }

    /** Modify a frame and replace its contents in DB
    *   @param {model.User} user The user modifying this Frame
    *   @param {Object} frame_data the object of the frame being modified
    *   @param {String} frame_id the id of the affected frame
    */
    async modify_frame(user, frame_data, frame_id) {

        this.frame_id = frame_id;
        await this.select();

        this.frame_data = frame_data;  
        await this.update(user);

    }

    /** Delete a frame 
    *   @param {model.User} user The user deleting this Frame
    *   @param {Object} frame_data the object of the frame being deleted
    *   @param {String} frame_id the id of the frame being deleted
    */
    async delete_frame(user, frame_data, frame_id) {

        this.id = frame_id;
        await this.select();

        this.frame_data = frame_data;          
        await this.delete(user);
    }
}