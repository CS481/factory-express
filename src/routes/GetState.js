import SimulationInstance from '../model/SimulationInstance.js';
import User from '../model/User.js';
import Router from "../Router.js";
import IdRequest from "../simulation-schema/js/IdRequest.js";
import StateSchema from "../simulation-schema/js/State.js";

var router = new Router("GetSimState", IdRequest, StateSchema);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    let state = await new SimulationInstance().getState(user, req.id);
    return state;
});

export default router;
