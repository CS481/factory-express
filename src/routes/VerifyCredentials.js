import User from '../model/User.js';
import Router from "../Router.js";
import UserSchema from "../simulation-schema/js/User.js";
import VoidSchema from "../simulation-schema/js/Void.js";

var router = new Router("VerifyCredentials", UserSchema, VoidSchema);
router.post(async function(req) {
    //await new User().fromJsonObject(req);
    return {eyy: "Bois"};
});

export default router;
