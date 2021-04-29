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
var fs = require('fs');
var Jimp = require('jimp');
var webp = require('webp-converter');
const ftp_1 = __importDefault(require("./../utils/ftp"));
var clientftp = new ftp_1.default(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
class ImageHelper {
    constructor() {
        this.types = ["_normal", "_thumb", "_x2"];
    }
    saveImageFile(imageBase64, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                imageBase64 = imageBase64.replace(/^data:image\/jpeg;base64,/, "");
                const path = `${process.env.SITE_IMAGE_PATH}${name}.jpg`;
                yield fs.writeFileSync(path, imageBase64, 'base64');
                yield this.createImageFormatAndUpload(name);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    createJPGAndUpload(name, size, suffix) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalImage = `${process.env.SITE_IMAGE_PATH}${name}.jpg`;
            const image = yield Jimp.read(originalImage);
            yield image.resize(size.width, size.height).quality(90);
            let result = yield image.getBufferAsync(Jimp.MIME_JPEG);
            yield fs.writeFileSync(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.jpg`, result);
            yield clientftp.upload(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.jpg`, `${process.env.REMOTE_IMAGES_PATH}${name}${suffix}.jpg`, 755);
        });
    }
    createWEBPAndUpload(name, size, suffix) {
        return __awaiter(this, void 0, void 0, function* () {
            webp.cwebp(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.jpg`, `${process.env.SITE_IMAGE_PATH}${name}${suffix}.webp`, "-q 80", function (status, error) {
                //if conversion successful status will be '100'
                //if conversion fails status will be '101'
                console.log(status, error);
            });
            yield clientftp.upload(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.webp`, `${process.env.REMOTE_IMAGES_PATH}${name}${suffix}.webp`, 755);
        });
    }
    createSingleImageAndUpload(name, size, suffix) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createJPGAndUpload(name, size, suffix);
            yield this.createWEBPAndUpload(name, size, suffix);
        });
    }
    createImageFormatAndUpload(name) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const type of this.types) {
                yield this.createSingleImageAndUpload(name, { width: 640, height: 640 }, type);
            }
        });
    }
    ftpRename(oldName, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const type of this.types) {
                const oldFile = `${process.env.REMOTE_IMAGES_PATH}${oldName}${type}.jpg`;
                const newFile = `${process.env.REMOTE_IMAGES_PATH}${newName}${type}.jpg`;
                yield clientftp.rename(oldFile, newFile);
            }
        });
    }
    ftpRemove(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const type of this.types) {
                fileName = `${process.env.REMOTE_IMAGES_PATH}${fileName}${type}.jpg`;
                yield clientftp.remove(fileName);
            }
        });
    }
}
exports.default = ImageHelper;
//# sourceMappingURL=ImageHelper.js.map