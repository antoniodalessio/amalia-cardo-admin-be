import BaseController from "./base.controller";
import { User } from '../models/'
import { Types } from 'mongoose';
import { toHash } from '../utils/utils'


class UserController extends BaseController {
  
  constructor() {
    super()
    this.model = User
  }

  async create(req: any, res: any) {

    console.log(req.body)

    try{
      const data = await this.model.find({username: req.body.username})
      if (data.length != 0) {
        res.status(500).json({error: `resource with a '${req.body.username}' already exists`})
        return;
      }

      req.body._id = new Types.ObjectId()
      if (req.body.hasOwnProperty('password') && req.body.password != '') {
        req.body.hash = toHash(req.body.username, req.body.password)
      }
      let user = new User(req.body)

      const result = await user.save()
      res.status(200).json(result);

    }catch(e){
      res.status(500).json(e)
    }
  }

  async update(req: any, res: any) {

    try {
      const id = req.params.id
      let data: any = await this.model.find({_id: id})
      
      if (data.length == 0) {
        res.status(500).json({error: `resource with '${id}' doesn't exists`})
        return;
      }

      if (req.body.hasOwnProperty('password') && req.body.password != '') {
        req.body.hash = toHash(req.body.username, req.body.password)
      }

      const result = await this.model.updateOne({ _id: id }, req.body)
      res.status(200).json(result);
    }catch(e) {
      res.status(500).json(e)
    }
  }
  
}

export default UserController;