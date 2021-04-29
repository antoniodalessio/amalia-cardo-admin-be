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
const ImageHelper_1 = __importDefault(require("../helpers/ImageHelper"));
var fs = require('fs');
var Jimp = require('jimp');
var webp = require('webp-converter');
const sharp = require('sharp');
class BatchOperations {
    constructor() {
        this.imgHelper = new ImageHelper_1.default();
        this.convertImagesToWebp();
        //this.test()
    }
    convertImagesToWebp() {
        return __awaiter(this, void 0, void 0, function* () {
            let files = yield fs.readdirSync('./site/images/');
            for (const file of files) {
                if (file.match(/.jpg/ig)) {
                    const fileName = file.replace('.png', '');
                    yield sharp(`${process.env.SITE_IMAGE_PATH}../${file}`)
                        .toFile(`${process.env.SITE_IMAGE_PATH}../${fileName}.webp`, (e, info) => { console.log(e, info); });
                }
            }
        });
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            yield webp.cwebp(`${process.env.SITE_IMAGE_PATH}bg_site_x2.jpeg`, `${process.env.SITE_IMAGE_PATH}../webp/vestito-cerimonia_normal.webp`, "-q 80", function (status, error) {
                //if conversion successful status will be '100'
                //if conversion fails status will be '101'
                console.log(status, error);
            });
        });
    }
}
exports.default = BatchOperations;
//# sourceMappingURL=index.js.map