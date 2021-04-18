import SimulationInstance from '../model/SimulationInstance.js';
import User from '../model/User.js';
import Router from "../Router.js";
import UserResponse from "../simulation-schema/js/UserResponse.js";
import StateSchema from "../simulation-schema/js/State.js";

var router = new Router("SubmitResponse", UserResponse, StateSchema);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    await new SimulationInstance().submit_response(user, req.response, req.id);
    let state = await new SimulationInstance().getState(user, req.id);
    return state;
});

export default router;
