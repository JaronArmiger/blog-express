const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const User = require('../models/user');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

module.exports = (passport) => {
  passport.use(new JwtStrategy(options, (jwt_payload, cb) => {
  	User.findOne({ _id: jwt_payload.sub }, (err, user) => {
  	  if (err) return cb(err, false);
  	  if (user) {
  	  	return cb(null, user);
  	  } else {
  	  	return cb(null, false);
  	  }
  	});
  }));
}