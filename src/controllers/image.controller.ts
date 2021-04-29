import BaseController from "./base.controller";
import { Image } from '../models/'
import { Types } from 'mongoose';


class ImageController extends BaseController {
  constructor() {
    super()
    this.model = Image
  }

  async getAll(req: any, res: any) {
    await super.getAll(req, res, '')
  }

  async get(req: any, res: any) {
    await super.get(req, res, '')
  }

  async create(req: any, res: any) {
    try{
      const data = await Image.find({uri: req.body.uri})
      if (data.length != 0) {
        res.status(500).json({error: `resource with a '${req.body.uri}' slug already exists`})
        return;
      }

      req.body._id = new Types.ObjectId()
      let image = new Image(req.body)

      const result = await image.save()
      res.status(200).json({data: result});

    }catch(e){
      res.status(500).json(e)
    }
  }

  async update(req: any, res: any) {

    try {
      const id = req.params.id
      let data: any = await Image.find({_id: id})
      
      if (data.length == 0) {
        res.status(500).json({error: `resource product with '${id}' doesn't exists`})
        return;
      }

      if (req.body.uri.hasOwnProperty('uri')) {
        req.body.uri = req.body.uri.uri
      }

      const result = await Image.updateOne({ _id: id }, req.body)
      res.status(200).json({data: result});
    }catch(e) {
      res.status(500).json(e)
    }
  }
}

export default ImageController;