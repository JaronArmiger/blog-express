const router = require('express').Router();
const Post = require('../models/Post');
const passport = require('passport');

router.get('/protected', passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
	  res.status(200).json({ success: true, msg: 'you are successfully authenticated ayy (posts)' });
});

module.exports = router;