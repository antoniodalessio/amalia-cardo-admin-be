"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fabric = void 0;
const mongoose_1 = require("mongoose");
const fabric = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    cod: {
        type: String,
        required: '{PATH} is required!'
    },
    color: {
        type: String,
    },
    motif: {
        type: String,
    },
    composition: {
        type: String,
    },
    use: {
        type: String,
    },
    thumb_preview: {
        type: String
    },
    ord: {
        type: Number
    },
    active: {
        type: Boolean,
        default: true
    },
});
exports.fabric = fabric;
fabric.index({ '$**': 'text' });
//# sourceMappingURL=fabric.js.map