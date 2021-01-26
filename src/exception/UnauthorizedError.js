import ServerException from "./ServerException.js";

export default class UnauthorizedError extends ServerException {
    constructor(message) {
        super(401, message);
    }
}
