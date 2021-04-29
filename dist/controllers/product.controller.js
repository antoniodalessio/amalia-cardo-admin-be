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
const ImageHelper_1 = __importDefault(require("../helpers/ImageHelper"));
const _ = require('underscore');
class ProductController extends base_controller_1.default {
    constructor() {
        super();
        this.model = models_1.Product;
        this.imageHelper = new ImageHelper_1.default();
    }
    getAll(req, res) {
        const _super = Object.create(null, {
            getAll: { get: () => super.getAll }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.getAll.call(this, req, res, 'images fabrics.internal fabrics.external');
        });
    }
    get(req, res) {
        const _super = Object.create(null, {
            get: { get: () => super.get }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.get.call(this, req, res, 'images fabrics.internal fabrics.external');
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield models_1.Product.find({ slug: req.body.slug });
                if (data.length != 0) {
                    res.status(500).json({ error: `resource with a '${req.body.slug}' slug already exists` });
                    return;
                }
                req.body.published = false;
                req.body.images = yield this.saveOrUpdateImages(req.body);
                req.body._id = new mongoose_1.Types.ObjectId();
                let product = new models_1.Product(req.body);
                let result = yield product.save();
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
                let data = yield models_1.Product.find({ _id: id }).populate('images');
                if (data.length == 0) {
                    res.status(500).json({ error: `resource product with '${id}' doesn't exists` });
                    return;
                }
                req.body.published = false;
                req.body.images = yield this.saveOrUpdateImages(req.body);
                let oldData = data[0].toObject();
                if (oldData.slug != req.body.slug) {
                    this.seoHelper.resourceChangeName(`${oldData.slug}.html`, `${req.body.slug}.html`);
                }
                // if (data.images.length > req.body.images.length) {
                //   //remove from ftp
                //   console.log(_.difference(data.images, req.body.images))
                // }
                let result = yield models_1.Product.updateOne({ _id: id }, req.body);
                res.status(200).json({ data: result });
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
    saveOrUpdateImages(newData) {
        return __awaiter(this, void 0, void 0, function* () {
            let imagesIDS = [];
            if (newData.images && newData.images.length > 0) {
                let images = newData.images;
                for (const image of images) {
                    let imageName = image.hasOwnProperty('uri') ? image.uri : image.file.rawFile.path.replace(".jpeg", "").replace(".jpg", "");
                    // upload image
                    if (image.file.hasOwnProperty('base64')) {
                        yield this.imageHelper.saveImageFile(image.file.base64, imageName);
                        image.uri = imageName;
                    }
                    else {
                        // modify only image name
                        const imageOld = yield models_1.Image.findOne({ _id: image._id });
                        if (imageOld && imageOld.uri != image.uri) {
                            yield this.imageHelper.ftpRename(imageOld.uri, image.uri);
                        }
                    }
                    //update or save
                    if (image.hasOwnProperty('_id')) {
                        yield models_1.Image.updateOne({ _id: image._id }, image);
                        imagesIDS.push(image._id);
                    }
                    else {
                        image._id = new mongoose_1.Types.ObjectId();
                        let imageInstance = new models_1.Image(image);
                        yield imageInstance.save();
                        imagesIDS.push(image._id);
                    }
                }
            }
            return imagesIDS;
        });
    }
}
exports.default = ProductController;
//# sourceMappingURL=product.controller.js.map