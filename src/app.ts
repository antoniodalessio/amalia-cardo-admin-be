const express = require('express')
var cors = require('cors');

import loginController from './controllers/login.controller'

import apiRoutes from './routes/api'
import publicRoutes from './routes/public'
import siteRoutes from './routes/site'

import SeoHelper from './helpers/SeoHelper';

const mongoose = require('mongoose');

var fs = require('fs');

import FTP from './utils/ftp'


class App {
  
  private _expressApp: any

  constructor() {


    //this.test() 

    console.log("app init")
    this.setupExpress()
    this.initMongoose()

    const seoHelper:SeoHelper = new SeoHelper()
    seoHelper.downloadHtaccess()

    

  }

  // async test() {
  //   try {

  //     console.log(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD)
  //     var clientftp = new FTP('ftp.amaliacardo.it', 21, '7489922@aruba.it', 'Password1847', true);
  //     //console.log(clientftp)
  //     let access = await clientftp.client.access(clientftp.settings);
  //     console.log(access)
  //     let upload = await clientftp.client.upload(fs.createReadStream('./server.js'), './www.amaliacardo.it/server.js');
  //     console.log(upload)

  //   }catch(e) {
  //     console.log(e)
  //   }
  // }

  setupExpress() {
    this._expressApp = express();
    this._expressApp.use(cors({
      "origin": '*',
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "exposedHeaders": ['Content-Range', 'X-Content-Range', '10'],
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    }));
    this._expressApp.use(express.static('site'))
    this._expressApp.use(express.json({limit: '50mb'}));
    this._expressApp.use(express.urlencoded({limit: '50mb'}));
    this._expressApp.setMaxListeners(0);

    this._expressApp.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT!}`);
    });

    let loginCTRL = new loginController()

    this._expressApp.post('/authenticate', async (req: any, res: any) => { await loginCTRL.login(req, res)} )
    this._expressApp.post('/checkAuth', async (req: any, res: any) => { await loginCTRL.checkAuth(req, res)} )
    this._expressApp.post('/logout', async (req: any, res: any) => { await loginCTRL.logout(req, res)} )

    this._expressApp.use('/api/', apiRoutes());
    this._expressApp.use('/public/', publicRoutes());

    //this._expressApp.use('/', siteRoutes())
    
  }

  async initMongoose() {
    let connection = await mongoose.connect(`${process.env.DB_HOST}${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
    
}


export default App;

