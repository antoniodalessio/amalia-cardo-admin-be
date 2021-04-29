'use strict';

const ftp = require('basic-ftp');
const fs = require('fs');

class FTPClient {

  client: any
  settings: any

  constructor(host: string = 'localhost', port: number = 21, username: string = 'anonymous', password: string = 'guest', secure: boolean = false) {
    this.client = new ftp.Client();
    this.settings = {
      host: host,
      port: port,
      user: username,
      password: password,
      secure: secure,
      secureOptions: { rejectUnauthorized: false }
    };
  }

  async upload(sourcePath: string, remotePath: string, perm: number) {
      
    try {
      let access = await this.client.access(this.settings);
      let upload = await this.client.upload(fs.createReadStream(sourcePath), remotePath);
      let permissions = await this.changePermissions(perm.toString(), remotePath);
    } catch(err) {
      console.log(err);
    }
    this.client.close();
      
  }

  async download(remotePath: string, sourcePath: string) {
    try {
      await this.client.access(this.settings);
      await this.client.downloadTo(sourcePath, remotePath)
    }catch(e) {
      console.log(e)
    }
    this.client.close();
  }

  close() {
    this.client.close();
  }

  changePermissions(perms: any, filepath: string) {
    let cmd = 'SITE CHMOD ' + perms + ' ' + filepath;
    return this.client.send(cmd, false);
  }

  async rename(oldFile: string, newFile: string) {
    let access = await this.client.access(this.settings);
    let rename = await this.client.rename(oldFile, newFile)
  }

  async remove(fileName: string) {
    await this.client.access(this.settings);
    await this.client.remove(fileName)
  }
}

export default FTPClient