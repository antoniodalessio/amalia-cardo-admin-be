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
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const page_controller_1 = __importDefault(require("../controllers/page.controller"));
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const builder_controller_1 = __importDefault(require("../controllers/builder.controller"));
const image_controller_1 = __importDefault(require("../controllers/image.controller"));
const customer_controller_1 = __importDefault(require("../controllers/customer.controller"));
const fabric_controller_1 = __importDefault(require("../controllers/fabric.controller"));
const review_controller_1 = __importDefault(require("../controllers/review.controller"));
const submission_controller_1 = __importDefault(require("../controllers/submission.controller"));
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
function initApiRoutes() {
    let userCTRL = new user_controller_1.default();
    let pageCTRL = new page_controller_1.default();
    let categoryCTRL = new category_controller_1.default();
    let productCTRL = new product_controller_1.default();
    let builderCTRL = new builder_controller_1.default();
    let imageCTRL = new image_controller_1.default();
    let customerCTRL = new customer_controller_1.default();
    let submissionCTRL = new submission_controller_1.default();
    let fabricCTRL = new fabric_controller_1.default();
    let reviewCTRL = new review_controller_1.default();
    let orderCTRL = new order_controller_1.default();
    routes.use((req, res, next) => verifyToken(req, res, next));
    routes.get('/user', (req, res) => __awaiter(this, void 0, void 0, function* () { yield userCTRL.getAll(req, res); }));
    routes.get('/user/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield userCTRL.get(req, res); }));
    routes.post('/user', (req, res) => __awaiter(this, void 0, void 0, function* () { yield userCTRL.create(req, res); }));
    routes.put('/user/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield userCTRL.update(req, res); }));
    routes.delete('/user/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield userCTRL.delete(req, res); }));
    routes.get('/page', (req, res) => __awaiter(this, void 0, void 0, function* () { yield pageCTRL.getAll(req, res); }));
    routes.get('/page/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield pageCTRL.get(req, res); }));
    routes.post('/page', (req, res) => __awaiter(this, void 0, void 0, function* () { yield pageCTRL.create(req, res); }));
    routes.put('/page/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield pageCTRL.update(req, res); }));
    routes.delete('/page/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield pageCTRL.delete(req, res); }));
    routes.get('/category', (req, res) => __awaiter(this, void 0, void 0, function* () { yield categoryCTRL.getAll(req, res); }));
    routes.get('/category/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield categoryCTRL.get(req, res); }));
    routes.post('/category', (req, res) => __awaiter(this, void 0, void 0, function* () { yield categoryCTRL.create(req, res); }));
    routes.put('/category/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield categoryCTRL.update(req, res); }));
    routes.delete('/category/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield categoryCTRL.delete(req, res); }));
    routes.get('/product', (req, res) => __awaiter(this, void 0, void 0, function* () { yield productCTRL.getAll(req, res); }));
    routes.get('/product/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield productCTRL.get(req, res); }));
    routes.post('/product', (req, res) => __awaiter(this, void 0, void 0, function* () { yield productCTRL.create(req, res); }));
    routes.put('/product/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield productCTRL.update(req, res); }));
    routes.delete('/product/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield productCTRL.delete(req, res); }));
    routes.get('/image', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.getAll(req, res); }));
    routes.get('/image/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.get(req, res); }));
    routes.post('/image', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.create(req, res); }));
    routes.put('/image/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.update(req, res); }));
    routes.delete('/image/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.delete(req, res); }));
    routes.get('/customer', (req, res) => __awaiter(this, void 0, void 0, function* () { yield customerCTRL.getAll(req, res); }));
    routes.get('/customer/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield customerCTRL.get(req, res); }));
    routes.post('/customer', (req, res) => __awaiter(this, void 0, void 0, function* () { yield customerCTRL.create(req, res); }));
    routes.put('/customer/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield customerCTRL.update(req, res); }));
    routes.delete('/customer/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield customerCTRL.delete(req, res); }));
    routes.get('/submission', (req, res) => __awaiter(this, void 0, void 0, function* () { yield submissionCTRL.getAll(req, res); }));
    routes.get('/submission/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield submissionCTRL.get(req, res); }));
    routes.post('/submission', (req, res) => __awaiter(this, void 0, void 0, function* () { yield submissionCTRL.create(req, res); }));
    routes.put('/submission/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield submissionCTRL.update(req, res); }));
    routes.delete('/submission/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield submissionCTRL.delete(req, res); }));
    routes.get('/fabric', (req, res) => __awaiter(this, void 0, void 0, function* () { yield fabricCTRL.getAll(req, res); }));
    routes.get('/fabric/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield fabricCTRL.get(req, res); }));
    routes.post('/fabric', (req, res) => __awaiter(this, void 0, void 0, function* () { yield fabricCTRL.create(req, res); }));
    routes.put('/fabric/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield fabricCTRL.update(req, res); }));
    routes.delete('/fabric/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield fabricCTRL.delete(req, res); }));
    routes.get('/review', (req, res) => __awaiter(this, void 0, void 0, function* () { yield reviewCTRL.getAll(req, res); }));
    routes.get('/review/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield reviewCTRL.get(req, res); }));
    routes.post('/review', (req, res) => __awaiter(this, void 0, void 0, function* () { yield reviewCTRL.create(req, res); }));
    routes.put('/review/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield reviewCTRL.update(req, res); }));
    routes.delete('/review/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield reviewCTRL.delete(req, res); }));
    routes.get('/order', (req, res) => __awaiter(this, void 0, void 0, function* () { yield orderCTRL.getAll(req, res); }));
    routes.get('/order/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield orderCTRL.get(req, res); }));
    routes.post('/order', (req, res) => __awaiter(this, void 0, void 0, function* () { yield orderCTRL.create(req, res); }));
    routes.put('/order/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield orderCTRL.update(req, res); }));
    routes.delete('/order/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield orderCTRL.delete(req, res); }));
    routes.get('/publish', (req, res) => __awaiter(this, void 0, void 0, function* () { yield builderCTRL.publish(req, res); }));
}
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else {
        // Forbidden
        res.sendStatus(403);
    }
}
exports.default = () => {
    initApiRoutes();
    return routes;
};
//# sourceMappingURL=api.js.map