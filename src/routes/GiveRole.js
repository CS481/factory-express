import User from '../model/User.js';
import Router from "../Router.js";
import GiveRole from "../simulation-schema/js/GiveRole.js";
import VoidSchema from "../simulation-schema/js/Void.js";

var router = new Router("GiveRole", GiveRole, VoidSchema);
router.post(async function(req){
    let user = await new User().fromJsonObject(req.user);
    delete req.user; 
    await user.RoleUpdate(user, req);
    return {};
});

export default router;