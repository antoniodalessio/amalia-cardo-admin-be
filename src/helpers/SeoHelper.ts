import FTP from './../utils/ftp'
var fs = require('fs');


class SeoHelper {
  
  private htaccessFileName = '.htaccess'
  private clientFtp: any

  constructor() {
    this.clientFtp = new FTP(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
  }

  async resourceChangeName(oldName: string, newName: string) {
    await fs.readFileSync(`${process.env.SITE_PATH}${this.htaccessFileName}`)
    const redirectLine = `\nredirect 301 /${oldName} /${newName}`
    await fs.appendFileSync(`${process.env.SITE_PATH}${this.htaccessFileName}`, redirectLine)
  }

  async downloadHtaccess() {
    await this.clientFtp.download(`${process.env.FTP_FOLDER}${this.htaccessFileName}`, `${process.env.SITE_PATH}${this.htaccessFileName}`)
  }

  async uploadHtaccess() {
    await this.clientFtp.upload(`${process.env.SITE_PATH}${this.htaccessFileName}`, `${process.env.FTP_FOLDER}${this.htaccessFileName}`, 755)
  }

}

export default SeoHelper