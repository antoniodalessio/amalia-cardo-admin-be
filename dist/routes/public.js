"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes = require('express').Router();
const contact_controller_1 = __importDefault(require("../controllers/contact.controller"));
function initPublicRoutes() {
    const contactCTRL = new contact_controller_1.default();
    routes.post('/contact', (req, res) => __awaiter(this, void 0, void 0, function* () { yield contactCTRL.contact(req, res); }));
    routes.post('/comment', (req, res) => __awaiter(this, void 0, void 0, function* () { yield contactCTRL.comment(req, res); }));
}
exports.default = () => {
    initPublicRoutes();
    return routes;
};
//# sourceMappingURL=public.js.map