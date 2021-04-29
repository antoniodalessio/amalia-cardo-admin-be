"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.page = void 0;
const mongoose_1 = require("mongoose");
const basePage_1 = require("./basePage");
const page = new mongoose_1.Schema(Object.assign(basePage_1.defaultPageField, {
    _id: mongoose_1.Schema.Types.ObjectId,
    resources: [
        { type: { type: String } }
    ],
    images: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Image' }
    ]
}));
exports.page = page;
page.index({ '$**': 'text' });
//# sourceMappingURL=page.js.map