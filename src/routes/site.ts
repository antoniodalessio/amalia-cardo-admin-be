const express = require('express')
const routes = require('express').Router();
var fs = require('fs');

import BuilderController from './../controllers/builder.controller'


function initSiteRoutes() {

  const builderCtrl = new BuilderController()

  // routes.get('/', async (req: any, res: any) => {
  //   const result = await builderCtrl.renderBySlug('index.html')
  //   res.send(result);
  // })

  // routes.get('/:pagename', async (req: any, res: any) => {
  //   const result = await builderCtrl.renderBySlug(req.params.pagename)
  //   res.send(result);
  // })
  
}



export default () => {
  initSiteRoutes();
  return routes
};