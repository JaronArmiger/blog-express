const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordMethods = require('./helpers/password.js');

passport.use(new LocalStrategy((username, password, cb) => {
  User.findOne({ username: username }, (err, user) => {
  	if (err) {
      return cb(err);
  	}
  	if (!user) {
  	  return cb(null, false, { msg: 'Incorrect username' });
  	}
  	const isValid = passwordMethods.validPassword(password, user.hash, user.salt);
  	if (isValid) {
  	  return cb(null, user, { msg: 'Logged in'});
  	} else {
  		return cb(null, false, { msg: 'Incorrect password' });
  	}
  })
}));