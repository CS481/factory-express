import express from 'express';
import ServerException from './exception/ServerException.js';
import InternalError from './exception/InternalError.js';
import UnprocessableError from "./exception/UnprocessableError.js";

export default class Router {
    static routes = []; // List of all the registered routes
    /**
     * Construct a new instance of Router
     * @param {String} route The route to use for this router
     * @param {Schema} inputValidater The schema that the input JSON must validate against
     * @param {Schema} outputValidater The schema that the returned JSON must validate against
     */
    constructor(route, inputValidater, outputValidater) {
        this.router = express.Router();
        this.inputValidater = inputValidater;
        this.outputValidater = outputValidater;
        Router.routes.push({router: this.router, route: `/${route}`});
    }

    /**
     * Executes async function when this route recieves a POST request.
     * The function is called with the request's JSON body.
     * The function must return the object to send back to the client
     * @param {function} func The asynchronous function to execute
     */
    post(func) {
        async function _post(req, res, next) {
            this._exception_handler(func, req, res, next);
        };
        this.router.post('/', _post.bind(this)); // Use bind() to avoid losing this caller's context
    }

    /**
     * Executes async function when this route recieves a GET request.
     * The function is called with the request's JSON body.
     * The function must return the object to send back to the client
     * @param {function} func The asynchronous function to execute
     */
    get(func) {
        async function _get(req, res, next) {
            this._exception_handler(func, req, res, next);
        };
        this.router.get('/', _get.bind(this)); // Use bind() to avoid losing this caller's context
    }

    /**
     * Adds all of the registered routes to the app
     * @param {express.app} app The app to add the routes to
     */
    static applyRoutes(app) {
        Router.routes.forEach(route => {
            app.use(route.route, route.router);
        });
    }

    async _exception_handler(func, req, res, next) {
        try {
            try {
                this.inputValidater.Validate(req.body);
            } catch (e) {
                throw new UnprocessableError(e.message);
            }
            let result = this.outputValidater.Validate(await func(req.body));
            res.setHeader("content-type", "text/json");
            res.send(result);
        } catch (e) {
            if (e instanceof ServerException) {
                console.trace(e);
                e.setResponse(res);
            } else {
                console.trace(e);
                new InternalError(e).setResponse(res);
            }
        }
    }
}
