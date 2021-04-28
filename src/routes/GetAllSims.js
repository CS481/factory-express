import SimulationInstance from '../model/SimulationInstance.js';
import User from '../model/User.js';
import Router from "../Router.js";
import IdRequest from "../simulation-schema/js/IdRequest.js";
import AllSimsSchema from "../simulation-schema/js/AllSims.js";

var router = new Router("GetAllSims", IdRequest, AllSimsSchema);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    let AllSims = await new Simulation().GetAllSims(user);
    return AllSims;
});

export default router;
