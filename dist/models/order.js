"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.order = void 0;
const mongoose_1 = require("mongoose");
const order = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    clientName: String,
    acquisitionDate: Date,
    orderFulfillmentDate: Date,
    paymentDate: Date,
    products: String,
    price: String,
    comment: String,
});
exports.order = order;
order.index({ '$**': 'text' });
//# sourceMappingURL=order.js.map