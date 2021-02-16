import ServerException from "./ServerException.js";

export default class ForbiddenError extends ServerException {
    constructor(message) {
        super(403, message);
    }
}
