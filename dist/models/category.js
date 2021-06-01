"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.category = void 0;
const mongoose_1 = require("mongoose");
const basePage_1 = require("./basePage");
const category = new mongoose_1.Schema(Object.assign(basePage_1.defaultPageField, {
    _id: mongoose_1.Schema.Types.ObjectId,
    text: {
        type: String
    },
    category_name: {
        type: String
    },
    thumb_preview: {
        type: String
    },
    parent: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    template: { type: String, default: 'category' },
    enabled: { type: Boolean, default: true },
    hasSubcategory: {
        type: Boolean,
    }
}));
exports.category = category;
category.index({ '$**': 'text' });
//# sourceMappingURL=category.js.map