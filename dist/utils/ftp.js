'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ftp = require('basic-ftp');
const fs = require('fs');
class FTPClient {
    constructor(host = 'localhost', port = 21, username = 'anonymous', password = 'guest', secure = false) {
        this.client = new ftp.Client();
        this.settings = {
            host: host,
            port: port,
            user: username,
            password: password,
            secure: secure,
            secureOptions: { rejectUnauthorized: false }
        };
    }
    upload(sourcePath, remotePath, perm) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let access = yield this.client.access(this.settings);
                let upload = yield this.client.upload(fs.createReadStream(sourcePath), remotePath);
                let permissions = yield this.changePermissions(perm.toString(), remotePath);
            }
            catch (err) {
                console.log(err);
            }
            this.client.close();
        });
    }
    download(remotePath, sourcePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.access(this.settings);
                yield this.client.downloadTo(sourcePath, remotePath);
            }
            catch (e) {
                console.log(e);
            }
            this.client.close();
        });
    }
    close() {
        this.client.close();
    }
    changePermissions(perms, filepath) {
        let cmd = 'SITE CHMOD ' + perms + ' ' + filepath;
        return this.client.send(cmd, false);
    }
    rename(oldFile, newFile) {
        return __awaiter(this, void 0, void 0, function* () {
            let access = yield this.client.access(this.settings);
            let rename = yield this.client.rename(oldFile, newFile);
        });
    }
    remove(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.access(this.settings);
            yield this.client.remove(fileName);
        });
    }
}
exports.default = FTPClient;
//# sourceMappingURL=ftp.js.map