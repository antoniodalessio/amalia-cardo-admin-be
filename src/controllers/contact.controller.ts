const nodemailer = require("nodemailer");
const fetch = require('node-fetch');
import { Customer, Review, Product, Submission, ISubmission } from '../models/'
import { Types } from 'mongoose';

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
  
  async sendEmailToInfo(data: any) {

    let msg: string = data.message;
    let subject: string = "Richiesta informazioni dal sito amaliacardo.it"

    if (data.hasOwnProperty('productId') && data.productId != '') {
      const product: any = (await Product.findOne({_id: data.productId})).toObject()
      subject = `Richiesta informazioni sul prodotto ${product.title} dal sito amaliacardo.it`
      msg = `Richiesta informazioni sul prodotto ${product.title} dal sito amaliacardo.it\n${data.message}`
    }

     let info = await transporter.sendMail({
      from: `"${data.name}" <${data.email}>`,
      to: `info@amaliacardo.it`,
      subject: subject,
      text: msg,
      html: ''
    });

    return info
  }

  async sendEmailToContact(data: any) {
    
    let info = await transporter.sendMail({
      from: `"Amalia Cardo" <info@amaliacardo.it>`,
      to: `${data.email}`,
      subject: "Richiesta informazioni dal sito amaliacardo.it",
      text: '',
      html: `❤️ Grazie ${data.name} per avermi contattato.<br>Risponderò a breve alla tua richiesta:<br><br><span style="font-size:10px; color: #999">${data.message}</span><br><br><br><br>Amalia Cardo`
    });

    return info

  }

  async saveInfo(data: any) {
    let customer: any = await Customer.findOne({email: data.email})

    if (!customer) {
      //save
      const id = new Types.ObjectId()
      const cust = new Customer({_id: id, email: data.email, firstname: data.name})
      customer = await cust.save()
    }

    const sub: any = {
      _id: new Types.ObjectId(),
      text: data.message,
      requestAt: new Date(),
      customer: customer._id
    }

    if (data.hasOwnProperty('productId') && data.productId != ''){
      const product: any = await Product.findOne({_id: data.productId})
      sub.product = product._id
    }
    const submission = new Submission(sub)
    await submission.save()

    return submission
  }
  
  async contact(req: any, res: any) {
    
    fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_TOKEN}&response=${req.body['g-recaptcha-response']}`
      })
      .then((result: any) => result.json())
      .then(async (result: any) => {
        
        let sendEmailContactRes;
        let sendEmailInfoRes;

        if (result.success) {
          sendEmailInfoRes = await this.sendEmailToInfo(req.body)
          sendEmailContactRes = await this.sendEmailToContact(req.body)
          const save = await this.saveInfo(req.body)
          //{"result":{"success":true,"challenge_ts":"2020-05-10T10:38:14Z","hostname":"127.0.0.1"},"sendEmailContactRes":{"accepted":["antonio@adias.it"],"rejected":[],"envelopeTime":88,"messageTime":112,"messageSize":526,"response":"250 2.0.0 cyei2200Z1BY3Mq01yeiA6 mail accepted for delivery","envelope":{"from":"info@amaliacardo.it","to":["antonio@adias.it"]},"messageId":"<c59f1b45-f0dc-f9f4-ba23-08c3541cc2b5@amaliacardo.it>"},"sendEmailInfoRes":{"accepted":["info@amaliacardo.it"],"rejected":[],"envelopeTime":214,"messageTime":113,"messageSize":355,"response":"250 2.0.0 cyei220041BY3Mq01yeiA0 mail accepted for delivery","envelope":{"from":"antonio@adias.it","to":["info@amaliacardo.it"]},"messageId":"<27746803-0680-4681-cf59-54e4e272c0a3@adias.it>"}}
          res.status(200).json({result, sendEmailContactRes, sendEmailInfoRes, save});
        }else{
          res.status(406).json({result, sendEmailContactRes, sendEmailInfoRes});
        }
        
      })
      .catch((e:any) => {
        res.status(406).json(e);
      })
  
  }


  async comment(req: any, res: any) {
    fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_TOKEN}&response=${req.body['g-recaptcha-response']}`
      })
      .then((result: any) => result.json())
      .then(async (res: any) => {
        let review = new Review({username: req.body.username, comment: req.body.comment, city: req.body.city})
        let result = review.save()
        res.status(200).json({result});
      })
      .catch((e:any) => {
        res.status(406).json(e);
      })
  }





}

export default ContactController