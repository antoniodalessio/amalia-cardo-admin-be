import BaseController from "./base.controller";
import { Page } from '../models/'


class PageController extends BaseController {
  
  constructor() {
    super()
    this.model = Page
  }
  
  async getAll(req: any, res: any) {
    await super.getAll(req, res, '')
  }

  async get(req: any, res: any) {
    await super.get(req, res, '')
  }

  async update(req: any, res: any) {
    req.body.published = false
    await super.update(req, res)
  }

  async create(req: any, res: any) {
    req.body.published = false
    await super.create(req, res)
  }

}

export default PageController;