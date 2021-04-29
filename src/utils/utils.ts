var crypto = require('crypto');

function toHash(username: string, password: string) {
  return crypto.createHash('sha256').update(`${username}${password}`).digest('base64');
}

function createRandomToken() {
  return crypto.randomBytes(64).toString('hex');
}


export { toHash, createRandomToken }