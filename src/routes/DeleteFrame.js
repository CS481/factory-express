import User from '../model/User.js';
import Frame from '../model/Frame.js';
import Router from "../Router.js";
import IdRequest from "../simulation-schema/js/IdRequest.js";
import Void from "../simulation-schema/js/Void.js";

var router = new Router("DeleteFrame", IdRequest, Void);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    delete req.user; // Remove user from the message so we don't override it
    await new Frame().delete_frame(user, req.id);
    return {};
});

export default router;
