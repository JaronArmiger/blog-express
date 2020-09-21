const router = require('express').Router();
const User = require('../models/user');
const utils = require('../lib/utils');

router.post('/login', (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
      	res.status(401).json({ success: false, msg: 'could not find user' });
      }
      const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
      if (isValid) {
      	const tokenObject = utils.issueJWT(user);
      	res.status(200).json({ 
      		success: true, token: tokenObject.token, 
      		expiresIn: tokenObject.expires });
      } else {
      	res.status(401).json({ success: false, msg: 'incorrect password' });
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/register', (req, res, next) => {
  const saltHash = utils.genPassword(req.body.password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
  	username: req.body.username,
  	hash,
  	salt,
  });

  newUser.save()
    .then((user) => {
    	res.json({ success: true, user,});
    })
    .catch(err => next(err));
});

module.exports = router;