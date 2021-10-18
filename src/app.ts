const express = require('express')
var cors = require('cors');

import loginController from './controllers/login.controller'

import apiRoutes from './routes/api'
import publicRoutes from './routes/public'
import siteRoutes from './routes/site'

import SeoHelper from './helpers/SeoHelper';

const mongoose = require('mongoose');

var fs = require('fs');

import WatcherService from './services/watcher.service';

import { execShellCommand } from './utils/utils'


class App {
  
  private _expressApp: any

  constructor() {
    let data = ""
    
    console.log("app init")
    this.setupExpress()
    this.initMongoose()

    const seoHelper:SeoHelper = new SeoHelper()
    seoHelper.downloadHtaccess()

    if (process.env.ENV == 'dev') {
      new WatcherService()
      //execShellCommand(`open http://127.0.0.1:${process.env.PORT}`)
    }

  }

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

    this._expressApp.use('/', express.static('./site'))
    
  }

  async initMongoose() {
    let connection = await mongoose.connect(`${process.env.DB_HOST}${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
    
}


export default App;

