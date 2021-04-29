"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.product = void 0;
const mongoose_1 = require("mongoose");
const basePage_1 = require("./basePage");
const product = new mongoose_1.Schema(Object.assign(basePage_1.defaultPageField, {
    _id: mongoose_1.Schema.Types.ObjectId,
    images: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Image' }
    ],
    fabrics: {
        internal: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Fabric' }],
        external: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Fabric' }]
    },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' },
    sku: {
        type: String
    },
    price: {
        type: String
    },
    priceValidUntil: Date,
    template: { type: String, default: 'product' },
    resources: [
        { type: { type: String } }
    ]
}));
exports.product = product;
product.index({ '$**': 'text' });
//# sourceMappingURL=product.js.map