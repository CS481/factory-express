import User from '../model/User.js';
import Frame from '../model/Frame.js';
import Router from "../Router.js";
import SimulationInstance from '../model/SimulationInstance.js';
import UserResponse from "../simulation-schema/js/UserResponse.js";
import IdRequest from "../simulation-schema/js/IdRequest.js";
import IdResponse from '../simulation-schema/js/IdResponse.js';

var router = new Router("SubmitReponse", UserResponse, Void);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    delete req.user; // Remove user from the message so we don't override it
    await new SimulationInstance().submit_response(user, req);
    //let simulation = new Simulation();
    //let State = await simulation.getState();
    return {}; 

});

export default router;