import BaseController from './base.controller'
import { Product, Image } from '../models/'
import { Types } from 'mongoose';
import ImageHelper from '../helpers/ImageHelper'
const _ =  require( 'underscore')



class ProductController extends BaseController{

  private imageHelper: ImageHelper
  
  constructor() {
    super()
    this.model = Product
    this.imageHelper = new ImageHelper()
  }

  async getAll(req: any, res: any) {
    await super.getAll(req, res, 'images fabrics.internal fabrics.external')
  }

  async get(req: any, res: any) {
    await super.get(req, res, 'images fabrics.internal fabrics.external')
  }

  async create(req: any, res: any) {
    
    try{
      const data = await Product.find({slug: req.body.slug})
      if (data.length != 0) {
        res.status(500).json({error: `resource with a '${req.body.slug}' slug already exists`})
        return;
      }

      req.body.published = false
      req.body.images = await this.saveOrUpdateImages(req.body)
      req.body._id = new Types.ObjectId()

      let product = new Product(req.body)

      let result = await product.save()

      // La richiesta è stata soddisfatta, restituendo la creazione di una nuova risorsa.
      res.status(201).json(result);
    }catch(e){
      res.status(500).json(e);
    }
  }


  async update(req: any, res: any) {
    
    try {
      const id = req.params.id
      let data: any = await Product.find({_id: id}).populate('images')
      
      if (data.length == 0) {
        res.status(500).json({error: `resource product with '${id}' doesn't exists`})
        return;
      }

      req.body.published = false
      req.body.images = await this.saveOrUpdateImages(req.body)

      let oldData = data[0].toObject()

      if (oldData.slug != req.body.slug) {
        this.seoHelper.resourceChangeName( `${oldData.slug}.html`,  `${req.body.slug}.html`)
      }

      // if (data.images.length > req.body.images.length) {
      //   //remove from ftp
      //   console.log(_.difference(data.images, req.body.images))
      // }
      
      let result = await Product.updateOne({ _id: id }, req.body)
      res.status(200).json({data: result});
    }catch(e) {
      res.status(500).json(e)
    }

  }


  async saveOrUpdateImages(newData: any) {
    
    let imagesIDS: any = []

    if (newData.images && newData.images.length > 0) {
      let images = newData.images
      for (const image of images) {
        let imageName = image.hasOwnProperty('uri') ? image.uri : image.file.rawFile.path.replace(".jpeg", "").replace(".jpg", "")
        
        // upload image
        if (image.file.hasOwnProperty('base64')){
          await this.imageHelper.saveImageFile(image.file.base64, imageName)
          image.uri = imageName
        }else{
          // modify only image name
          const imageOld = await Image.findOne({_id: image._id})
          if (imageOld && imageOld.uri != image.uri) {
            await this.imageHelper.ftpRename(imageOld.uri, image.uri)
          }
        }

        //update or save
        if (image.hasOwnProperty('_id')) {
          await Image.updateOne({ _id: image._id }, image)
          imagesIDS.push(image._id)
        }else{
            image._id = new Types.ObjectId()
            let imageInstance = new Image(image)
            await imageInstance.save()
            imagesIDS.push(image._id)
        } 
        
      }
    }

    return imagesIDS

  }

}

export default ProductController;