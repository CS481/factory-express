import Simulation from '../model/Simulation.js';
import SimulationInstance from '../model/SimulationInstance.js';
import User from '../model/User.js';
import Router from "../Router.js";
import IdRequest from "../simulation-schema/js/IdRequest.js";
import VoidSchema from "../simulation-schema/js/Void.js";

var router = new Router("BeginSim", IdRequest, VoidSchema);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    delete req.user;
    let simulation = await new Simulation().fromJsonObject(req);
    await simulation.begin_sim(user);
    let state = await new SimulationInstance().getState(user, req.id);
    return state;
});

export default router;
