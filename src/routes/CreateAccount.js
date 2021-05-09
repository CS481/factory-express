import User from '../model/User.js';
import Router from "../Router.js";
import AccountCreationSchema from "../simulation-schema/js/AccountCreation.js";

var router = new Router("CreateAccount", AccountCreationSchema);
router.post(async function(req) {
    let auth_user = await new User().fromJsonObject(req.auth_user);

    await auth_user.SignUp(req.new_user);

    return {};
});

export default router;
