import BuildController from '../controllers/builder.controller'
var watch = require('node-watch');
const fs = require('fs-extra')
import { execShellCommand, getExt } from '../utils/utils'

class WatcherService {

  private jsonConfig: any = {}

  constructor() {
    this.init()
  }

  async init() {
    this.jsonConfig = await fs.readJson(`${process.env.ASSETS_FOLDER}js/config.json`)
    this.watchTemplate()
    this.watchScss()
    this.watchJs()
  }

  async watchTemplate() {
    this.buildTemplate()
    watch(`${process.env.ASSETS_FOLDER}templates/`, { recursive: true }, async (evt: any, name: any) => {
      this.buildTemplate()
    });
  }

  async watchScss() {
    this.compileScss()
    watch(`${process.env.ASSETS_FOLDER}scss/`, { recursive: true }, async (evt: any, name: any) => {
      this.compileScss()
    });
  }

  async watchJs() {
    this.compileJs()
    watch(`${process.env.ASSETS_FOLDER}js/`, { recursive: true }, async (evt: any, name: any) => {
      this.compileJs()
    });
  }

  async buildTemplate() {
    console.log("compile template")
    const buildController = new BuildController()
    buildController.publish(null, null)
  }

  async compileScss() {
    console.log("compile scss")
    fs.readdir(`${process.env.ASSETS_FOLDER}scss/`, async (err: any, files: any) => {
      files.forEach(async (file: any) => {
        const filename = file.replace('.scss', '')
        if (!(/^_/.test(file)) && file != 'partials' && getExt(file) == 'scss') {
          await execShellCommand(`sass ${process.env.ASSETS_FOLDER}scss/${filename}.scss:${process.env.SITE_PATH}css/${filename}.css --style compressed`)
        }
      })
    })
  }

  async compileJs() {
    console.log("compile js")
    fs.readdir(`${process.env.ASSETS_FOLDER}js/`, async (err: any, files: any) => {
      files.forEach(async (file: any) => {
        if (file != 'config.json') {
          const filename = file.replace('.js', '')
          const common = this.jsonConfig.common.concat(this.jsonConfig[filename])
          await execShellCommand(`uglifyjs ${common.join(' ')} ${process.env.ASSETS_FOLDER}js/${file} -c -o ${process.env.SITE_PATH}js/${filename}.min.js`)
        }
      })
    })
  }

}

export default WatcherService