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
const ftp_1 = __importDefault(require("./../utils/ftp"));
var fs = require('fs');
class SeoHelper {
    constructor() {
        this.htaccessFileName = '.htaccess';
        this.clientFtp = new ftp_1.default(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
    }
    resourceChangeName(oldName, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs.readFileSync(`${process.env.SITE_PATH}${this.htaccessFileName}`);
            const redirectLine = `\nredirect 301 /${oldName} /${newName}`;
            yield fs.appendFileSync(`${process.env.SITE_PATH}${this.htaccessFileName}`, redirectLine);
        });
    }
    downloadHtaccess() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.clientFtp.download(`${process.env.FTP_FOLDER}${this.htaccessFileName}`, `${process.env.SITE_PATH}${this.htaccessFileName}`);
        });
    }
    uploadHtaccess() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.clientFtp.upload(`${process.env.SITE_PATH}${this.htaccessFileName}`, `${process.env.FTP_FOLDER}${this.htaccessFileName}`, 755);
        });
    }
}
exports.default = SeoHelper;
//# sourceMappingURL=SeoHelper.js.map