const async = require('async');
const Post = require('../models/post');
const Comment = require('../models/comment');
const validator = require('express-validator');
const passport = require('passport');

exports.post_list = (req, res, next) => {
  Post.find()
    .populate('author')
    .exec((err, list_posts) => {
      if (err) return next(err);
      res.send(list_posts);
    });
}


exports.post_detail = (req, res, next) => {
  async.parallel({
  	post: (callback) => {
  	  Post.findById(req.params.id)
  	    .populate('author')
  	    .exec(callback);
  	},
  	post_comments: (callback) => {
  	  Comment.find({ 'post': req.params.id })
  	    .exec(callback);
  	}

  }, (err, results) => {
  	   if (err) return next(err);
  	   if (results.post == null) {
  	   	 const err = new Error('Post not found');
  	   	 err.status = 404;
  	   	 return next(err);
  	   }
  	   res.send({ 
  	     post: results.post, post_comments: results.post_comments 
  	   });
  });
};

exports.post_create_get = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.send(req.user);
  }
]

exports.post_create_post = [
  validator.body('title', 'Title length 1-90 Characters').isLength({ min: 1, max: 90 }),
  validator.body('content', 'Post must have content').trim().isLength({ min: 1 }),
  validator.sanitizeBody('title').escape(),
  validator.sanitizeBody('content').escape(),
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const errors = validator.validationResult(req);
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
    });
    if (!errors.isEmpty()) {
      res.send({ 
      	msg: 'Errors have occurred :(', 
      	errors: errors.Array(),
      });
    } else {
      post.save((err) => {
      	if (err) return next(err);
      	res.send(post);
      });
    }
  }
]

exports.post_update_get = (req, res, next) => {
  
}

exports.post_update_post = (req, res, next) => {
  
}

exports.post_delete = (req, res, next) => {
  
}