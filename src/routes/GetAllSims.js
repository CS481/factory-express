import Simulation from '../model/Simulation.js';
import User from '../model/User.js';
import Router from "../Router.js";
import AllSimsSchema from "../simulation-schema/js/AllSims.js";
import AllSimsRespSchema from "../simulation-schema/js/AllSimsResp.js";

var router = new Router("GetAllSims", AllSimsSchema, AllSimsRespSchema);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    let AllSims = await new Simulation().GetAllSims(user,req.id);
    return AllSims;
});

export default router;