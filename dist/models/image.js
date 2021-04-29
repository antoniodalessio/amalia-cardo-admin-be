"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.image = void 0;
const mongoose_1 = require("mongoose");
const image = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    alt: {
        type: String,
    },
    uri: {
        type: String
    },
    ord: {
        type: Number
    }
});
exports.image = image;
//# sourceMappingURL=image.js.map