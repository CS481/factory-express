import ServerException from "./ServerException.js";

export default class BadRequestError extends ServerException {
    constructor(message) {
        super(400, message);
    }
}
