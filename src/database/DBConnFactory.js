import MongoConn from "./MongoConn.js";

export default function DBConnFactory() {
    return new MongoConn();
}
