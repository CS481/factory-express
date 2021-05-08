import User from '../model/User.js';
import Router from "../Router.js";
import GiveRoleSchema from "../simulation-schema/js/GiveRole.js";
import VoidSchema from "../simulation-schema/js/Void.js";

var router = new Router("GiveRole", GiveRoleSchema, VoidSchema);
router.post(async function(req){}
    let user = await new User().fromJsonObject(req.user);
    delete req.user; // Remove user from the message so we don't override it in modify_sim{
    await new User().RoleUpdate(user,req);
    return {};
});

export default router;