import User from '../model/User.js';
import Frame from '../model/Frame.js';
import Router from "../Router.js";
import FrameModification from "../simulation-schema/js/FrameModification.js";
import Void from "../simulation-schema/js/Void.js";

var router = new Router("FrameModification", FrameModification, Void);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    delete req.user; // Remove user from the message so we don't override it in modify_sim
    await new Frame().modify_frame(user, req);
    return {};
});

export default router;
