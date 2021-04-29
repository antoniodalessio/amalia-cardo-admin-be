"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const routes = require('express').Router();
var fs = require('fs');
const builder_controller_1 = __importDefault(require("./../controllers/builder.controller"));
function initSiteRoutes() {
    const builderCtrl = new builder_controller_1.default();
    // routes.get('/', async (req: any, res: any) => {
    //   const result = await builderCtrl.renderBySlug('index.html')
    //   res.send(result);
    // })
    // routes.get('/:pagename', async (req: any, res: any) => {
    //   const result = await builderCtrl.renderBySlug(req.params.pagename)
    //   res.send(result);
    // })
}
exports.default = () => {
    initSiteRoutes();
    return routes;
};
//# sourceMappingURL=site.js.map