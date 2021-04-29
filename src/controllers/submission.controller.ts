import BaseController from "./base.controller";
import { Submission } from '../models/'


class SubmissionController extends BaseController {
  
  constructor() {
    super()
    this.model = Submission
  }
  
}

export default SubmissionController;