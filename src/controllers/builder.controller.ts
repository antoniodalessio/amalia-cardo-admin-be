import Assemble from './../assemble'
import FTP from './../utils/ftp'
import { Page, Category, Product, Image, Review, ICategory, Fabric } from '../models'
import { IProduct  } from '../models/product';
var fs = require('fs');
import SeoHelper from '../helpers/SeoHelper'
import { shuffle } from '../utils/array'

interface IBreadcrumb {
  slug: string
  label: string
}

class BuilderController {

  private assemble: any
  private clientFtp: any
  private fileToUpload: string[] = []
  private seoHelper: SeoHelper

  constructor() {
    this.initAssemble()
    this.clientFtp = new FTP(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
    this.seoHelper = new SeoHelper()
  }

  async initAssemble(){
    this.assemble = new Assemble({
      templatesPath: process.env.TEMPLATES_PATH,
      partialsPath: `${process.env.TEMPLATES_PATH}/partials/`,
      defaultLayout: `${process.env.TEMPLATES_PATH}/layout/default.hbs`,
      defaultFolder: `${process.env.SITE_PATH}`
    })
  }


  async buildSitemapXml(){

    const categories = (await Category.find()).map((item: any) => item ? item.toObject(): null)
    const products = (await Product.find().populate('images')).map((item: any) => item ? item.toObject() : null)
    const pages = (await Page.find()).map((item: any) => item ? item.toObject() : null)
    const resources = categories.concat(products).concat(pages)

    const data = {
      resources: resources.filter((resource) => resource.template != 'index' && resource.template != '404'),
      baseUrl: process.env.SITE_URL,
      slug: 'sitemap'
    }

    await this.assemble.renderSimple('sitemap', data, "xml")
    await this.clientFtp.upload(`${process.env.SITE_PATH}sitemap.xml`, `${process.env.FTP_FOLDER}sitemap.xml`, 755)
  }
  
  async getSubcategories(id: any) {
    return (await Category.find({parent: id}).sort('ord')).map((item: any) => item ? item.toObject() : null)
  }

  async getProductsOfCategory(id: any) {
    return (await Product.find({category: id}).sort('ord').populate('images')).map((item: any) => item ? item.toObject() : null)
  }


  async getProductsFromSubCategory(id: any) {
    const categories = (await Category.find({parent: id}).sort('ord')).map((item: any) => item ? item.toObject() : null)
    let products: any = [];
    for(const category of categories ) {
      products = products.concat((await Product.find({category: category._id}).populate('images')).map((item: any) => item ? item.toObject() : null))
    }
    return shuffle(products)
  }

  async addResources(page: any) {

    if (page.hasOwnProperty('resources') && page.resources.length > 0){
      
      let resources: any = {}

      for (const resource of page.resources) {

        if (resource.type == 'category') {
          // find main category
          const parentCategory = await Category.findOne({parent: null})
          const _id = parentCategory.toObject()._id
          
          // get subcategory of main category
          const categories = (await Category.find({parent: _id}).sort('ord')).map((item: any) => item ? item.toObject() : null)
          for(const category of categories ) {
            const products = (await Product.find({category: category._id}).populate('images')).map((item: any) => item ? item.toObject() : null)
            if (products.length > 0) {
              const subcategoryProduct = await this.getProductsFromSubCategory(category._id)
              category.products = shuffle(products.concat(subcategoryProduct))
            }else{
              // load products randomly? from subcategory 
              category.products = await this.getProductsFromSubCategory(category._id)
            }
          }
          
          resources.categories = categories
        }

        if (resource.type == 'review') {
          const reviews = (await Review.find(resource.filter).sort('_id')).map((item: any) => item ? item.toObject() : null)
          resources.reviews = reviews
        }

        if (resource.type == 'fabric') {
          const fabrics = (await Fabric.find(resource.filter).sort('_id')).map((item: any) => item ? item.toObject() : null)
          resources.fabrics = fabrics
        }

      }

      page.resources = resources

    }

    return page

  }

  async buildStaticPages() {

    const pages = (await Page.find()).map((item: any) => item ? item.toObject() : null)
    const pags = []
    for(let page of pages) {
      page = await this.addResources(page)
      page.pageImage = `${process.env.SITE_URL}/images/logo.png`
      pags.push(page)
    }
    return pags;
  }

  async uploadStaticPages(pages: any, unpublished: boolean) {
    for(let page of pages) {
      if (!unpublished || !page.published) {
        await this.assemble.render(page.template, page)
        this.fileToUpload.push(page.slug)
        await Page.updateOne({_id: page._id}, {published: true})
      }
    }
  }


  async buildBreadCrumb(cat: ICategory, array: IBreadcrumb[] = []):Promise<IBreadcrumb[]> {
    array.push(
      {
        slug: cat.slug,
        label: cat.category_name
      }
    )
    if (!cat.parent){
      return array
    }else{
      const parentCat = (await Category.findOne({_id: cat.parent})).toObject()
      return await this.buildBreadCrumb(parentCat, array)
    }
  }


  async buildCategories() {
    let categories = await Category.find().sort('ord')
    let cats = [];
    for(const category of categories) {
      let cat:any = category.toObject()
      cat.products = await this.getProductsOfCategory(category._id)
      cat.pageImage = `${process.env.SITE_URL}${process.env.IMAGES_PATH}${cat.thumb_preview}_normal.jpg`
      cat.products.forEach((product: any) => {
        product.thumb = product.hasOwnProperty("images") && product.images.length > 0 ? product.images[0].uri : null
      });
      cat.breadcrumb = (await this.buildBreadCrumb(cat)).reverse()
      //if(category.hasSubcategory) {
        cat.categories = await this.getSubcategories(category._id)
      //}
      cats.push(cat)
    }

    return cats;
  }

  async uploadCategories(categories: any, unpublished: boolean) {
   
      for(const cat of categories) {
        if (!unpublished || !cat.published) {
          cat.hasSubcategory ?  await this.assemble.render("categories", cat) : await this.assemble.render("category", cat)
          this.fileToUpload.push(cat.slug)
          await Category.updateOne({_id: cat._id}, {published: true})
        }
      }
  }

  async renderFabrics(product: IProduct) {
    if (product.fabrics) {
    
      const fabrics = {
        internal: product.fabrics.internal.map((item: any) => item && typeof item.toObject == 'function' ? item.toObject() : null),
        external: product.fabrics.external.map((item: any) => item && typeof item.toObject == 'function' ? item.toObject() : null),
      }

      const tmpData = {
        slug: product.slug + '_fabrics',
        fabrics
      }
      await this.assemble.renderSimple('fabrics-popup', tmpData)
    }
  }

  async buildProducts() {
    let products = await Product.find().populate({path: 'images', options: { sort: { 'ord': 1 } } }).populate('fabrics.internal fabrics.external category')
    let prods = [];
    for(const product of products) {
      let prod = product.toObject()
      prod.resources = [{type: 'review', filter: {product: prod._id}}]
      prod = await this.addResources(prod)
      prod.pageImage = `${process.env.SITE_URL}${process.env.IMAGES_PATH}${prod.images[0].uri}_normal.jpg`
      const category = (await Category.findOne({_id: prod.category})).toObject()
      prod.breadcrumb = (await this.buildBreadCrumb(category)).reverse()
      prod.breadcrumb.push({slug: prod.slug, label: prod.title})
      prod.fabrics = product.fabrics
      prods.push(prod)     
    }
    return prods;
  }

  async uploadProducts(products: any, unpublished: boolean) {
    for(const product of products) {
      if (!unpublished || !product.published) {
        if ( product.fabrics.internal.length || product.fabrics.external.length) {
          await this.renderFabrics(product)
          this.fileToUpload.push(`${product.slug}_fabrics`)
        }
        await this.assemble.render("product", product)
        this.fileToUpload.push(product.slug)
        await Product.updateOne({_id: product._id}, {published: true})
      }
    }
  }

  async build(unpublished: boolean) {
    await this.uploadCategories(await this.buildCategories(), unpublished)
    await this.uploadProducts(await this.buildProducts(), unpublished)
    await this.uploadStaticPages(await this.buildStaticPages(), unpublished)
  }

  async upload() {
    let filesUploaded = []

    for(const file of this.fileToUpload) {
      await this.clientFtp.upload(`${process.env.SITE_PATH}${file}.html`, `${process.env.FTP_FOLDER}${file}.html`, 755)
      filesUploaded.push(`${file}`)
    }

    this.fileToUpload = []

    return {filesUploaded}
  }

  async clearFolder() {
    let filesToRemove: any = await fs.readdirSync(`${process.env.SITE_PATH}`).filter( (file: any) => {
      return file.match(/.html/ig)
    });

    for(const file of filesToRemove) {
      await fs.unlinkSync(`${process.env.SITE_PATH}${file}`)
    }
  }

  async renderBySlug(name: string) {

    const allPages = [await this.buildCategories(), await this.buildStaticPages(), await this.buildProducts()].reduce((acc:any, curr:any) => {
      return acc.concat(curr)
    })

    for (let page of allPages) {
      page = await this.addResources(page)
    }
    
    name = name.replace(".html", "")
    const page: any = allPages.filter(resource => resource.slug == name)
    console.log(page[0].template)
    const result = await this.assemble.renderPage(page[0])

    return result

  }

  async publish(req: any, res: any) {

    let unpublished = false
    if (req.query.hasOwnProperty('unpublished')) {
      unpublished = true
    }

    await this.build(unpublished)
    let result = await this.upload()
    if (process.env.ENV == 'prod') {
      await this.clearFolder()
    }

    await this.buildSitemapXml()
    await this.seoHelper.uploadHtaccess()
    await this.seoHelper.downloadHtaccess()

    res.status(200).json(result);
  }
}

export default BuilderController