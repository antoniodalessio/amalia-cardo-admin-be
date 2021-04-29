import BaseController from "./base.controller";
import { Fabric } from '../models/'
import ImageHelper from '../helpers/ImageHelper'
import { Types } from 'mongoose';


class FabricController extends BaseController {
  
  private imageHelper: ImageHelper

  constructor() {
    super()
    this.model = Fabric
    this.imageHelper = new ImageHelper()
  }
  
  
  async getAll(req: any, res: any) {
    await super.getAll(req, res, '')
  }

  async get(req: any, res: any) {
    await super.get(req, res, '')
  }

  async create(req: any, res: any) {
    try{
      const data = await this.model.find({slug: req.body.cod})
      if (data.length != 0) {
        res.status(500).json({error: `resource with a '${req.body.cod}' slug already exists`})
        return;
      }

      req.body._id = new Types.ObjectId()

      await this.saveOrUpdateImagePreview(req.body)

      let fabric = new Fabric(req.body)

      let result = await fabric.save()

      // La richiesta è stata soddisfatta, restituendo la creazione di una nuova risorsa.
      res.status(201).json(result);
    }catch(e){
      res.status(500).json(e);
    }
  }

  async update(req: any, res: any) {
    
    try {
      const id = req.params.id
      const data: any = await this.model.find({_id: id}).populate('products')
      
      if (data.length == 0) {
        res.status(404).json({error: `resource with '${id}' doesn't exists`})
        return;
      }

      await this.saveOrUpdateImagePreview(req.body)

      let result = await this.model.updateOne({ _id: id }, req.body)
      res.status(200).json({data: result});
    }catch(e) {
      res.status(500).json(e)
    }
  }

  async saveOrUpdateImagePreview(data: any) {
    if (data.hasOwnProperty('file') && data.file.hasOwnProperty('base64')) {
      let imageName = data.hasOwnProperty('thumb_preview') ? data.thumb_preview : data.file.rawFile.path.replace(".jpeg", "").replace(".jpg", "")
      await this.imageHelper.saveImageFile(data.file.base64, imageName)
      data.thumb_preview = imageName
    }else{
      const fabric = await this.model.findOne({_id: data.id})
      if (fabric && fabric.thumb_preview != data.thumb_preview) {
        await this.imageHelper.ftpRename(fabric.thumb_preview, data.thumb_preview)
      }
    }
  }

}

export default FabricController;