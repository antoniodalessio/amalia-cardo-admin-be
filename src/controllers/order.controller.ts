import BaseController from "./base.controller";
import { Order } from '../models/'


class ReviewController extends BaseController {
  
  constructor() {
    super()
    this.model = Order
  }
  
}

export default ReviewController;