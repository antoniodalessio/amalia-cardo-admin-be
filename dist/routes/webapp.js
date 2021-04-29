"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes = require('express').Router();
function initWebAppRoutes() {
    routes.get('/', (req, res) => { /* call controller method */ res.end("webapp!"); });
}
exports.default = () => {
    initWebAppRoutes();
    return routes;
};
//# sourceMappingURL=webapp.js.map