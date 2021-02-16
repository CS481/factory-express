import User from '../model/User.js';
import Simulation from '../model/Simulation.js';
import Router from "../Router.js";
import SimulationModification from "../simulation-schema/js/SimulationModification.js";
import Void from "../simulation-schema/js/Void.js";

var router = new Router("SimulationModification", SimulationModification, Void);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    delete req.user; // Remove user from the message so we don't override it in modify_sim
    await new Simulation().modify_sim(user, req);
    return {};
});

export default router;
