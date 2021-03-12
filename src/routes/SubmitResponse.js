import SimulationInstance from '../model/SimulationInstance.js';
import User from '../model/User.js';
import Router from "../Router.js";
import UserResponse from "../simulation-schema/js/UserResponse.js";
import StateSchema from "../simulation-schema/js/State.js";

var router = new Router("SubmitResponse", UserResponse, StateSchema);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    let state = await new SimulationInstance().getState(user, req.id);
    return state;
});

export default router;
