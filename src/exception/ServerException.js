export default class ServerException extends Error {
    /**
     * Custom error class that uses http error codes
     * @param {Number} code The http error code
     * @param {String} message The error message
     */
    constructor(code, message) {
        super(message);
        this.statusCode = code;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ServerException);
        }
    }

    /**
     * Set the appropriate headers and data for the http response
     * @param {express.response} res 
     */
    setResponse(res) {
        res.status(this.statusCode);
        res.send(this.message);
    }
}
