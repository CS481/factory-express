import User from '../model/User.js';
import Router from "../Router.js";
import UserSchema from "../simulation-schema/js/User.js";

var router = new Router("CreateAccount", UserSchema);
router.post(async function(req) {
    await User.SignUp(req);
});

export default router;
