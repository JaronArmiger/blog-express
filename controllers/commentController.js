const async = require('async');
const Post = require('../models/post');
const Comment = require('../models/comment');
const validator = require('express-validator');
const passport = require('passport');

exports.comment_list = (req, res, next) => {
  Comment.find({ 'post': req.postId })
    .exec((err, comments) => {
      if (err) return next(err);
      res.send(comments);
    })
}

exports.comment_detail = (req, res, next) => {
  Comment.findById(req.params.commentId)
    .populate('post')
    .exec((err, comment) => {
      if (err) return next(err);
      if (comment == null) {
        const err = new Error('Comment not found');
        err.status = 401;
        return next(err);
      }
      res.send(comment);
    });
}

exports.comment_create = [
  passport.authenticate('jwt', { session: false }),
  validator.body('content', 'Max length 140 chars').isLength({ max: 140 }),
  validator.sanitizeBody('content').escape(),
  (req, res, next) => {
  	const errors = validator.validationResult(req);
  	const comment = new Comment({
      content: req.body.content,
      post: req.postId,
      author: req.user._id,
  	});
  	if (!errors.isEmpty()) {
  	  res.send({
  	  	msg: 'Errors have occurred :\'(',
        errors: errors.Array(),
  	  });
  	} else {
  	  comment.save((err) => {
  	  	if (err) return next(err);
  	  	res.send(comment);
  	  });
  	}
  }
]