import { json } from "express";
import IJSONable from "./IJSONable.js";
import Simulation from "./Simulation.js";

export default class State extends IJSONable {
    async toJsonObject() {
        let obj = {
            user_waiting: this.user_waiting,
            turn_number: this.turn_number,
            response_deadline: this.response_deadline,
            prompt: this.prompt,
            player_responses: this.player_responses,
            user_id: this.user_id
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
        let simulation = await new Simulation().fromJsonObject({id: this.simulation})
        await simulation.select()
        this.prompt = simulation.prompt;
        this.player_responses = simulation.player_responses;
        this.responses = simulation.responses.keys();

        return this;
    }
}
