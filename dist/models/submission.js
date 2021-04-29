"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submission = void 0;
const mongoose_1 = require("mongoose");
const submission = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    text: {
        type: String,
    },
    requestAt: Date,
    customer: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Customer'
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Product'
    }
});
exports.submission = submission;
submission.index({ '$**': 'text' });
//# sourceMappingURL=submission.js.map