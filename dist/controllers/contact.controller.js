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
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const fetch = require('node-fetch');
const models_1 = require("../models/");
const mongoose_1 = require("mongoose");
let transporter = nodemailer.createTransport({
    host: "smtps.aruba.it",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PWD
    }
});
class ContactController {
    sendEmailToInfo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let msg = data.message;
            let subject = "Richiesta informazioni dal sito amaliacardo.it";
            if (data.hasOwnProperty('productId') && data.productId != '') {
                const product = (yield models_1.Product.findOne({ _id: data.productId })).toObject();
                subject = `Richiesta informazioni sul prodotto ${product.title} dal sito amaliacardo.it`;
                msg = `Richiesta informazioni sul prodotto ${product.title} dal sito amaliacardo.it\n${data.message}`;
            }
            let info = yield transporter.sendMail({
                from: `"${data.name}" <${data.email}>`,
                to: `info@amaliacardo.it`,
                subject: subject,
                text: msg,
                html: ''
            });
            return info;
        });
    }
    sendEmailToContact(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let info = yield transporter.sendMail({
                from: `"Amalia Cardo" <info@amaliacardo.it>`,
                to: `${data.email}`,
                subject: "Richiesta informazioni dal sito amaliacardo.it",
                text: '',
                html: `❤️ Grazie ${data.name} per avermi contattato.<br>Risponderò a breve alla tua richiesta:<br><br><span style="font-size:10px; color: #999">${data.message}</span><br><br><br><br>Amalia Cardo`
            });
            return info;
        });
    }
    saveInfo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let customer = yield models_1.Customer.findOne({ email: data.email });
            if (!customer) {
                //save
                const id = new mongoose_1.Types.ObjectId();
                const cust = new models_1.Customer({ _id: id, email: data.email, firstname: data.name });
                customer = yield cust.save();
            }
            const sub = {
                _id: new mongoose_1.Types.ObjectId(),
                text: data.message,
                requestAt: new Date(),
                customer: customer._id
            };
            if (data.hasOwnProperty('productId') && data.productId != '') {
                const product = yield models_1.Product.findOne({ _id: data.productId });
                sub.product = product._id;
            }
            const submission = new models_1.Submission(sub);
            yield submission.save();
            return submission;
        });
    }
    contact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            fetch("https://www.google.com/recaptcha/api/siteverify", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `secret=${process.env.RECAPTCHA_TOKEN}&response=${req.body['g-recaptcha-response']}`
            })
                .then((result) => result.json())
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                let sendEmailContactRes;
                let sendEmailInfoRes;
                if (result.success) {
                    sendEmailInfoRes = yield this.sendEmailToInfo(req.body);
                    sendEmailContactRes = yield this.sendEmailToContact(req.body);
                    const save = yield this.saveInfo(req.body);
                    //{"result":{"success":true,"challenge_ts":"2020-05-10T10:38:14Z","hostname":"127.0.0.1"},"sendEmailContactRes":{"accepted":["antonio@adias.it"],"rejected":[],"envelopeTime":88,"messageTime":112,"messageSize":526,"response":"250 2.0.0 cyei2200Z1BY3Mq01yeiA6 mail accepted for delivery","envelope":{"from":"info@amaliacardo.it","to":["antonio@adias.it"]},"messageId":"<c59f1b45-f0dc-f9f4-ba23-08c3541cc2b5@amaliacardo.it>"},"sendEmailInfoRes":{"accepted":["info@amaliacardo.it"],"rejected":[],"envelopeTime":214,"messageTime":113,"messageSize":355,"response":"250 2.0.0 cyei220041BY3Mq01yeiA0 mail accepted for delivery","envelope":{"from":"antonio@adias.it","to":["info@amaliacardo.it"]},"messageId":"<27746803-0680-4681-cf59-54e4e272c0a3@adias.it>"}}
                    res.status(200).json({ result, sendEmailContactRes, sendEmailInfoRes, save });
                }
                else {
                    res.status(406).json({ result, sendEmailContactRes, sendEmailInfoRes });
                }
            }))
                .catch((e) => {
                res.status(406).json(e);
            });
        });
    }
    comment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            fetch("https://www.google.com/recaptcha/api/siteverify", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `secret=${process.env.RECAPTCHA_TOKEN}&response=${req.body['g-recaptcha-response']}`
            })
                .then((result) => result.json())
                .then((res) => __awaiter(this, void 0, void 0, function* () {
                let review = new models_1.Review({ username: req.body.username, comment: req.body.comment, city: req.body.city });
                let result = review.save();
                res.status(200).json({ result });
            }))
                .catch((e) => {
                res.status(406).json(e);
            });
        });
    }
}
exports.default = ContactController;
//# sourceMappingURL=contact.controller.js.map