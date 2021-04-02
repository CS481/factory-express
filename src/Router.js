import express from 'express';
import ServerException from './exception/ServerException.js';
import InternalError from './exception/InternalError.js';
import UnprocessableError from "./exception/UnprocessableError.js";
import VoidSchema from "./simulation-schema/js/Void.js";

export default class Router {
    static routes = []; // List of all the registered routes
    /**
     * Construct a new instance of Router
     * @param {String} route The route to use for this router
     * @param {Schema} inputValidater The schema that the input JSON must validate against
     * @param {Schema} outputValidater The schema that the returned JSON must validate against
     */
    constructor(route, inputValidater, outputValidater=VoidSchema) {
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
     * Executes async function when this route recieves a POST request.
     * The function is called with the request's JSON body.
     * This function is used when we need to serve a file to the client 
     * @param {function} func The asynchronous function to execute
     * @param {function} after Optional asynchronous callback function that executes after the file is downloaded. This function will receive the file path and any errors that occured
     */
    post_download(func, after=undefined) {
        function _after(path) {
            function _after_inner(err) {
                if (after != undefined) {
                    after(path, err)
                }
            };
            return _after_inner.bind(this);
        };
        async function _post_download(req, res, next) {
            this._exception_handler(func, req, res, next, true, _after.bind(this));
        };

        this.router.post('/', _post_download.bind(this));
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

    /**
     * Safely executes func and handles all errors that occur
     * @param {*} func The function to execute that handles the client's request
     * @param {*} req The client's request
     * @param {*} res The response to send the client 
     * @param {*} next 
     * @param {boolean} download Whether or not we're trying to serve a file to the client
     * @param {func} callback Optional asynchronous callback executed after file download. Only used if download=true
     */
    async _exception_handler(func, req, res, next, download=false, callback=undefined) {
        try {
            try {
                this.inputValidater.Validate(req.body);
            } catch (e) {
                throw new UnprocessableError(e.message);
            }

            if (download) {
                let path = await func(req.body);
                res.download(path, path, callback(path));
            } else {
                res.setHeader("content-type", "text/json");
                let response_body = await func(req.body);
                if (response_body == undefined) {
                    response_body = {};
                } 
            }

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
