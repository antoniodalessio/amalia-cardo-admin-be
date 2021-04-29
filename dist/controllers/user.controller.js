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
const base_controller_1 = __importDefault(require("./base.controller"));
const models_1 = require("../models/");
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils/utils");
class UserController extends base_controller_1.default {
    constructor() {
        super();
        this.model = models_1.User;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            try {
                const data = yield this.model.find({ username: req.body.username });
                if (data.length != 0) {
                    res.status(500).json({ error: `resource with a '${req.body.username}' already exists` });
                    return;
                }
                req.body._id = new mongoose_1.Types.ObjectId();
                if (req.body.hasOwnProperty('password') && req.body.password != '') {
                    req.body.hash = utils_1.toHash(req.body.username, req.body.password);
                }
                let user = new models_1.User(req.body);
                const result = yield user.save();
                res.status(200).json(result);
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                let data = yield this.model.find({ _id: id });
                if (data.length == 0) {
                    res.status(500).json({ error: `resource with '${id}' doesn't exists` });
                    return;
                }
                if (req.body.hasOwnProperty('password') && req.body.password != '') {
                    req.body.hash = utils_1.toHash(req.body.username, req.body.password);
                }
                const result = yield this.model.updateOne({ _id: id }, req.body);
                res.status(200).json(result);
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map