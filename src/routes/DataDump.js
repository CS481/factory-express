import User from '../model/User.js';
import Router from "../Router.js";
import IdRequest from "../simulation-schema/js/IdRequest.js";
import { unlink } from 'fs';
import uuid from 'uuid';

var router = new Router("DataDump", IdRequest);
router.post_download(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    let filename = uuid.v4();
    return `/tmp/${filename}.sav`;
},
function after(path, err) {
    if (err != undefined) {
        console.log(`An error occurred downloading the file:\n${err}`);
    }
    unlink(path, err => {
        if (err != undefined) {
            console.log(`An error occurred removing the file:\n${err}`);
        }
    });  
});

export default router;