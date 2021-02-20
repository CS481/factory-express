import User from '../model/User.js';
import Simulation from '../model/Simulation.js';
import Router from "../Router.js";
import UserSchema from "../simulation-schema/js/User.js";
import IdResponse from "../simulation-schema/js/IdResponse.js";

var router = new Router("SimulationInitialization", UserSchema, IdResponse);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req);
    let simulation = new Simulation();
    let id = await simulation.init_sim(user);
    return {id: id};
});

export default router;
