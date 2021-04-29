import { Types } from 'mongoose';
import SeoHelper from '../helpers/SeoHelper'


class BaseController {
  
  protected model:any;
  protected seoHelper: SeoHelper

  constructor() {
    this.seoHelper = new SeoHelper()
  }

  isEmpty(obj: any) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
  
  async getAll(req: any, res: any, populate: string = '') {
      try {
        let limit = 0

        let filter: any = {}
        let sort = {}
        let range = []

        if (req.query.hasOwnProperty('filter')){
          filter = JSON.parse(req.query.filter)

          if (filter.hasOwnProperty('id')) {
            filter._id = Object.assign([], filter.id)
            delete(filter.id)
          }

          if (filter.hasOwnProperty("q")) {
            //$text: {$search: request.searchtext}
            filter.$text = {$search: filter.q}
            delete filter.q
          }
        }
        
        if (req.query.hasOwnProperty('range')) {
          range = JSON.parse(req.query.range)
        }

        if (req.query.hasOwnProperty('sort')) {
          const sortTmp = JSON.parse(req.query.sort)
          sortTmp[1] == 'ASC' ? sort = `${sortTmp[0]}` : sort = `-${sortTmp[0]}`
        }

        const all = await this.model.find(filter)

        limit = range[1] - range[0] + 1

        const data = await this.model.find(filter).sort(sort).skip(range[0]).limit(limit).populate(populate)
        res.header('Content-Range' , all.length );
        res.status(200).json(data);
      }catch(e) {
        res.status(500).json(e);
      }
    }

    async get(req: any, res: any, populate: string = '') {
      try {
        const id = req.params.id
        const data = await this.model.findOne({_id: id}).populate(populate)
        res.status(200).json(data);
      }catch(e) {
        res.status(500).json(e);
      }
    }

    async create(req: any, res: any) {
      try {
        req.body._id = new Types.ObjectId()
        const model = new this.model(req.body)
        const result = await model.save()
        res.status(201).json(result);
      }catch(e) {
        res.status(500).json(e);
      }
    }

    async update(req: any, res: any) {
      try {
        const id = req.params.id
        const data: any = await this.model.find({_id: id})
        if (data.length == 0) {
          res.status(404).json({error: `resource with '${id}' doesn't exists`})
          return;
        }

        let oldData = data[0].toObject()

        if (oldData.hasOwnProperty('slug') && oldData.slug != req.body.slug) {
          this.seoHelper.resourceChangeName( `oldData.slug}.html`, `${req.body.slug}.html`)
        }

        let result = await this.model.updateOne({ _id: id }, req.body)
        res.status(200).json({data: result});
      }catch(e) {
        res.status(500).json(e);
      }
    }

    async delete(req: any, res: any) {
      const id = req.params.id
      this.model.deleteOne({ _id:  id}, function (err: any) {
        if (err) {
          console.log(err)
          return
        }
      });
    }
}

export default BaseController;