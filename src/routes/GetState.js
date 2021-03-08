import User from '../model/User.js';
import Frame from '../model/Frame.js';
import State from '../model/State.js';
import Router from "../Router.js";
import IdRequest from "../simulation-schema/js/IdRequest.js";
import IdResponse from '../simulation-schema/js/IdResponse.js';
import SimulationInstance from '../model/SimulationInstance.js';

var router = new Router("GetState", IdRequest, State);
router.post(async function(req) {
    let user = await new User().fromJsonObject(req.user);
    delete req.user; // Remove user from the message so we don't override it
    //let simulation = new Simulation();
    //let State = await simulation.getState();
    let State ={
            "user_waiting": "true",
            "turn_number": 1,
            "response_deadline": 3,
            "object":{
                "resources":[
                    {
                    "name":"money",
                    "value":10
                    }
                ],
                "user_resouces":[
                    {
                    "name":"money",
                    "value":10,
                    "user":"austin"
                    }
                ]
            },
            "history": "history",
            "prompt": "prompt",
            "responses": "responses",
            "user_id": 12
    }
    return {State}; 
});

export default router;