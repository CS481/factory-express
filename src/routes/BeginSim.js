import Simulation from '../model/Simulation.js';
import SimulationInstance from '../model/SimulationInstance.js';
import User from '../model/User.js';
import Router from "../Router.js";
import IdRequest from "../simulation-schema/js/IdRequest.js";
import StateSchema from "../simulation-schema/js/State.js";

var router = new Router("BeginSim", IdRequest, StateSchema);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    delete req.user;
    let simulation = await new Simulation().fromJsonObject(req);
    await simulation.begin_sim(user);
    let state = await new SimulationInstance().getState(user, req.id);
    return state;
});

export default router;
