import Simulation from '../model/Simulation.js';
import User from '../model/User.js';
import Router from "../Router.js";
import UserSchema from "../simulation-schema/js/User.js";
import AllSimsRespSchema from "../simulation-schema/js/AllSimsResp.js";

var router = new Router("GetAllSims", UserSchema, AllSimsRespSchema);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req);
    let AllSims = await new Simulation().GetAllSims(user);
    return AllSims;
});

export default router;