"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customer = void 0;
const mongoose_1 = require("mongoose");
const customer = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    firstname: {
        type: String
    },
    lastname: {
        type: String,
    },
    address: {
        type: String
    },
    email: {
        type: String
    },
    cell: {
        type: String,
    },
    info: {
        type: String,
    },
    ord: {
        type: Number
    }
});
exports.customer = customer;
customer.index({ '$**': 'text' });
//# sourceMappingURL=customer.js.map