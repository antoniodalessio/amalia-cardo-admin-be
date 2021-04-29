"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var handlebars = require("handlebars");
handlebars.registerHelper('limit', function (arr, limit) {
    if (!Array.isArray(arr)) {
        return [];
    }
    return arr.slice(0, limit);
});
handlebars.registerHelper({
    eq: (v1, v2) => v1 === v2,
    ne: (v1, v2) => v1 !== v2,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    and() {
        return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
    listlt: (v1, v2) => v1 + 1 < v2,
});
handlebars.registerHelper('escape', function (variable) {
    return variable.replace(/(['"])/g, '\\$1');
});
exports.default = handlebars;
//# sourceMappingURL=handlebarsHelper.js.map