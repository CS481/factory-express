import ServerException from "./ServerException.js";

export default class UnimplementedError extends ServerException {
    constructor() {
        super(501, "Unimplemented");
    }
}
