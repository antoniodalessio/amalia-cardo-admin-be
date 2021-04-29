import imageHelper from '../helpers/ImageHelper'
var fs = require('fs');
var Jimp = require('jimp');
var webp = require('webp-converter');
const sharp = require('sharp');


class BatchOperations {

  private imgHelper: imageHelper 

  constructor() {
    this.imgHelper = new imageHelper()
    this.convertImagesToWebp()
    //this.test()
  }
  
  async convertImagesToWebp() {
    let files = await fs.readdirSync('./site/images/')
    for(const file of files) {
      if(file.match(/.jpg/ig)) {
        const fileName = file.replace('.png', '')

        await sharp(`${process.env.SITE_IMAGE_PATH}../${file}`)
                .toFile(`${process.env.SITE_IMAGE_PATH}../${fileName}.webp`, (e: any, info: any) => {console.log(e, info)})
      }
    }
  }

  async test() {
    await webp.cwebp(
      `${process.env.SITE_IMAGE_PATH}bg_site_x2.jpeg`,
      `${process.env.SITE_IMAGE_PATH}../webp/vestito-cerimonia_normal.webp`,
      "-q 80",
      function(status: any,error: any){
         //if conversion successful status will be '100'
        //if conversion fails status will be '101'
        console.log(status,error);	
      });
  }
}

export default BatchOperations