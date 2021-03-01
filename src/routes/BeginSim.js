import User from '../model/User.js';
import Frame from '../model/Frame.js';
import SimulationInstance from '../model/SimulationInstance.js';
import Router from "../Router.js";
import IdRequest from "../simulation-schema/js/IdRequest.js";
import IdResponse from '../simulation-schema/js/IdResponse.js';

var router = new Router("BeginSim", IdRequest, State);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    delete req.user; // Remove user from the message so we don't override it
    let id = await new Frame().init_frame(user, req.id);
    let simulation = new Simulation();
    let State = await simulation.getState();
    return {State: State}; 

});

export default router;