import User from '../model/User.js';
import Router from "../Router.js";
import GiveRollSchema from "../simulation-schema/js/GiveRoll.js";
import VoidSchema from "../simulation-schema/js/Void.js";

var router = new Router("GiveRoll", GiveRollSchema, VoidSchema);
router.post(async function(req) 
    let user = await new User().fromJsonObject(req.user);
    delete req.user; // Remove user from the message so we don't override it in modify_sim{
    await User.RollUpdate(req);
    return {};
});

export default router;