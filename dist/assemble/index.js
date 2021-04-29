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
const handlebarsHelper_1 = __importDefault(require("../helpers/handlebarsHelper"));
var fs = require('fs');
const YAML = require('yaml');
class Assemble {
    constructor(options) {
        this.options = options;
        this.createPartials();
    }
    createPartials() {
        return __awaiter(this, void 0, void 0, function* () {
            let files = fs.readdirSync(this.options.partialsPath);
            files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                const data = yield fs.readFileSync(`${this.options.partialsPath}${file}`, 'utf8');
                handlebarsHelper_1.default.partials[file.replace(".hbs", "")] = handlebarsHelper_1.default.compile(data);
            }));
        });
    }
    setTemplate(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const template = yield fs.readFileSync(`${this.options.templatesPath}/${name}.hbs`, 'utf8');
                let templateData = this.parseData(template);
                handlebarsHelper_1.default.partials['body'] = handlebarsHelper_1.default.compile(templateData.template);
                return templateData.data;
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    render(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let templateFile = yield fs.readFileSync(`${this.options.defaultLayout}`, 'utf8');
            let newdata = yield this.setTemplate(name, data);
            let template = handlebarsHelper_1.default.compile(templateFile);
            const tmpData = Object.assign(data, newdata);
            let result = template(tmpData);
            try {
                yield fs.writeFileSync(`${this.options.defaultFolder}${data.slug}.html`, result);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    renderPage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let templateFile = yield fs.readFileSync(`${this.options.defaultLayout}`, 'utf8');
            let newdata = yield this.setTemplate(data.template, data);
            console.log(newdata);
            let template = handlebarsHelper_1.default.compile(templateFile);
            const tmpData = Object.assign(data, newdata);
            return yield template(tmpData);
        });
    }
    renderSimple(templatename, data, ext = "html") {
        return __awaiter(this, void 0, void 0, function* () {
            //render template without a layout
            let templateFile = yield fs.readFileSync(`${this.options.templatesPath}/${templatename}.hbs`, 'utf8');
            let template = handlebarsHelper_1.default.compile(templateFile);
            let result = template(data);
            try {
                yield fs.writeFileSync(`${this.options.defaultFolder}${data.slug}.${ext}`, result);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    parseData(template) {
        let pattern = /---([\s\S]*)---/gim;
        let text = pattern.exec(template);
        let data = {};
        if (text && text.length > 1) {
            data = YAML.parse(text[1]);
        }
        return {
            template: template.replace(pattern, ""),
            data
        };
    }
}
exports.default = Assemble;
//# sourceMappingURL=index.js.map