import User from '../model/User.js';
import Frame from '../model/Frame.js';
import Router from "../Router.js";
import IdRequest from "../simulation-schema/js/IdRequest.js";
import IdResponse from '../simulation-schema/js/IdResponse.js';

var router = new Router("DataDump", IdRequest, );
router.post(async function(req) {
    

});

export default router;