const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');

const validPassword = (password, hash, salt) => {
  const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

const genPassword = (password) => {
  const salt = crypto.randomBytes(32).toString('hex');
  const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return {
  	salt,
  	hash: genHash,
  }
}

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

const issueJWT = (user) => {
 const _id = user.id;
 const expiresIn = '1d';

 const payload = {
 	sub: _id,
 	iat: Date.now(),
 };

 const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn, algorithm: 'RS256' });

 return {
   token: 'Bearer ' + signedToken,
   expires: expiresIn,
 }
}

module.exports = { validPassword, genPassword, issueJWT };