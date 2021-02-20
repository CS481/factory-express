import User from '../model/User.js';
import Frame from '../model/Frame.js';
import Router from "../Router.js";
import IdRequest from "../simulation-schema/js/IdRequest.js";
import IdResponse from '../simulation-schema/js/IdResponse.js';

var router = new Router("FrameInitialization", IdRequest, IdResponse);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    delete req.user; // Remove user from the message so we don't override it
    let id = await new Frame().init_frame(user, req.id);
    return {id: id};
});

export default router;
