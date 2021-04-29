const routes = require('express').Router();

function initWebAppRoutes() {
  routes.get('/', (req: any, res: any) => { /* call controller method */ res.end("webapp!")})
}

export default () => {
  initWebAppRoutes();
  return routes
};