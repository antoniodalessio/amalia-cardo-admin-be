import BaseController from "./base.controller";
import { Customer } from '../models/'


class CustomerController extends BaseController {
  
  constructor() {
    super()
    this.model = Customer
  }
  
  
  async getAll(req: any, res: any) {
    await super.getAll(req, res, '')
  }

  async get(req: any, res: any) {
    await super.get(req, res, '')
  }

}

export default CustomerController;