import BaseController from "./base.controller";
import { Review } from '../models/'


class ReviewController extends BaseController {
  
  constructor() {
    super()
    this.model = Review
  }
  
}

export default ReviewController;