import IJSONable from "./IJSONable.js";
import Simulation from "./Simulation.js";

export default class State extends IJSONable {
    async toJsonObject() {
        let obj = {
            user_waiting: this.user_waiting,
            turn_number: this.turn_number,
            response_deadline: this.response_deadline,
            prompt: this.prompt,
            user_id: this.user_id,
            responses: this.responses,
            start_text: this.start_text,
            end_text: this.end_text
        };
        obj.history = await Promise.all(this.history.map(async h => h.toJsonObject()));
        Object.keys(obj).map((key, _) => {
            if (obj[key] == undefined) {
                delete obj[key];
            }
        });
        return obj;
    }

    /**
     * Not a traditional implementation of this method; creates a StateHistory from a SimulationInstance
     */
    async fromJsonObject(jsonObj) {
        // Set fields from the simulationinstance
        this.turn_number = jsonObj.turn_number;
        this.response_deadline = jsonObj.deadline;

        // Set fields from the simulation
        let simulation = await new Simulation().fromJsonObject({id: jsonObj.simulation})
        await simulation.select()
        this.prompt = simulation.prompt;
        this.responses = simulation.responses;
        this.start_text = simulation.start_text;
        this.end_text = simulation.end_text;

        return this;
    }
}
