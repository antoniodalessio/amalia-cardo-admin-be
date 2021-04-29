"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomToken = exports.toHash = void 0;
var crypto = require('crypto');
function toHash(username, password) {
    return crypto.createHash('sha256').update(`${username}${password}`).digest('base64');
}
exports.toHash = toHash;
function createRandomToken() {
    return crypto.randomBytes(64).toString('hex');
}
exports.createRandomToken = createRandomToken;
//# sourceMappingURL=utils.js.map