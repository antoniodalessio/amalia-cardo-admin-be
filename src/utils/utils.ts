var crypto = require('crypto');
import { exec } from 'child_process'

function toHash(username: string, password: string) {
  return crypto.createHash('sha256').update(`${username}${password}`).digest('base64');
}

function createRandomToken() {
  return crypto.randomBytes(64).toString('hex');
}

function getExt(filename: string) {
  return filename.split('.')[filename.split('.').length -1] 
}

const execShellCommand = function(cmd: any) {
    
    return new Promise((resolve, reject) => {
     exec(cmd, (error, stdout, stderr) => {
      if (error) {
       console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
     });
    });
   }


export { toHash, createRandomToken, execShellCommand, getExt }