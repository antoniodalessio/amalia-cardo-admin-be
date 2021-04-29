"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const mongoose_1 = require("mongoose");
const user = new mongoose_1.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    username: {
        type: String
    },
    hash: {
        type: String
    },
    token: {
        type: String
    }
});
exports.user = user;
//# sourceMappingURL=user.js.map