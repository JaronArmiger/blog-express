const router = require('express').Router();
const User = require('../models/user');
const utils = require('../lib/utils');

router.post('/login', (req, res, next) => {
  
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