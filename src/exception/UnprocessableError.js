import ServerException from "./ServerException.js";

export default class UnprocessableError extends ServerException {
    constructor(message) {
        super(422, message);
    }
}
