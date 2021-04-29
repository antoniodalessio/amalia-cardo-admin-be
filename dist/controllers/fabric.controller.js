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
const ImageHelper_1 = __importDefault(require("../helpers/ImageHelper"));
const mongoose_1 = require("mongoose");
class FabricController extends base_controller_1.default {
    constructor() {
        super();
        this.model = models_1.Fabric;
        this.imageHelper = new ImageHelper_1.default();
    }
    getAll(req, res) {
        const _super = Object.create(null, {
            getAll: { get: () => super.getAll }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.getAll.call(this, req, res, '');
        });
    }
    get(req, res) {
        const _super = Object.create(null, {
            get: { get: () => super.get }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.get.call(this, req, res, '');
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.model.find({ slug: req.body.cod });
                if (data.length != 0) {
                    res.status(500).json({ error: `resource with a '${req.body.cod}' slug already exists` });
                    return;
                }
                req.body._id = new mongoose_1.Types.ObjectId();
                yield this.saveOrUpdateImagePreview(req.body);
                let fabric = new models_1.Fabric(req.body);
                let result = yield fabric.save();
                // La richiesta è stata soddisfatta, restituendo la creazione di una nuova risorsa.
                res.status(201).json(result);
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
                const data = yield this.model.find({ _id: id }).populate('products');
                if (data.length == 0) {
                    res.status(404).json({ error: `resource with '${id}' doesn't exists` });
                    return;
                }
                yield this.saveOrUpdateImagePreview(req.body);
                let result = yield this.model.updateOne({ _id: id }, req.body);
                res.status(200).json({ data: result });
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
    saveOrUpdateImagePreview(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.hasOwnProperty('file') && data.file.hasOwnProperty('base64')) {
                let imageName = data.hasOwnProperty('thumb_preview') ? data.thumb_preview : data.file.rawFile.path.replace(".jpeg", "").replace(".jpg", "");
                yield this.imageHelper.saveImageFile(data.file.base64, imageName);
                data.thumb_preview = imageName;
            }
            else {
                const fabric = yield this.model.findOne({ _id: data.id });
                if (fabric && fabric.thumb_preview != data.thumb_preview) {
                    yield this.imageHelper.ftpRename(fabric.thumb_preview, data.thumb_preview);
                }
            }
        });
    }
}
exports.default = FabricController;
//# sourceMappingURL=fabric.controller.js.map