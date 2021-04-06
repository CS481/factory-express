import User from '../model/User.js';
import Simulation from "../model/Simulation.js";
import Router from "../Router.js";
import IdRequest from "../simulation-schema/js/IdRequest.js";
import { unlink } from 'fs';
import { v4 } from 'uuid';
import { exec } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";

var router = new Router("DataDump", IdRequest);
router.post_download(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    let filename = v4();
    let tempdir = tmpdir().replace(/\\/g, '/');
    let csvname = `${tempdir}/${filename}.csv`;
    let savname = `${tempdir}/${filename}.sav`;
    await new Simulation().data_dump(user, req.id, csvname);
    await promisify(exec)(`npm run sav -- ${csvname} ${savname}`);
    return savname;
},
function after(path, err) {
    if (err != undefined) {
        console.log(`An error occurred downloading the file:\n${err}`);
    }
    unlink(path, err => {
        if (err != undefined) {
            console.log(`An error occurred removing the sav file:\n${err}`);
        }
    });
    let csv_path = path.substring(0, path.length-4) + ".csv";
    unlink(csv_path, err => {
        if (err != undefined) {
            console.log(`An error occurred removing the csv file:\n${err}`);
        }
    });
});

export default router;