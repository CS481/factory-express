import User from '../model/User.js';
import Router from "../Router.js";
import UserSchema from "../simulation-schema/js/User.js";
import VoidSchema from "../simulation-schema/js/Void.js";

var router = new Router("CreateAccount", UserSchema, VoidSchema);
router.post(async function(req) {
    await User.SignUp(req);
    return {};
});

export default router;
