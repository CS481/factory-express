import ServerException from "./ServerException.js";

export default class SimEndError extends ServerException {
    constructor(message) {
        super(425, message);
    }
}
