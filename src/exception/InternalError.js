import ServerException from "./ServerException.js";

export default class InternalError extends ServerException {
    /**
     * Construct an internal server error from any given error
     * @param {Error} from The error to construct from
     */
    constructor(from) {
        super(500, `Internal server error: ${from.message}`);
    }
}
