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
  	  Post.findById(req.params.postId)
  	    .populate('author')
  	    .exec(callback);
  	},
  	post_comments: (callback) => {
  	  Comment.find({ 'post': req.params.postId })
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

exports.post_create = [
  passport.authenticate('jwt', { session: false }),
  validator.body('title', 'Title length 1-90 Characters').isLength({ min: 1, max: 90 }),
  validator.body('content', 'Post must have content').trim().isLength({ min: 1 }),
  validator.sanitizeBody('title').escape(),
  validator.sanitizeBody('content').escape(),
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


exports.post_update = [
  passport.authenticate('jwt', { session: false }),
  validator.body('title', 'Title length 1-90 Characters').isLength({ min: 1, max: 90 }),
  validator.body('content', 'Post must have content').trim().isLength({ min: 1 }),
  validator.sanitizeBody('title').escape(),
  validator.sanitizeBody('content').escape(),
  (req, res, next) => {
    const errors = validator.validationResult(req);
    Post.findById(req.params.postId)
    .populate('author')
    .exec((err, post) => {
      if (err) return next(err);
      if (!errors.isEmpty()) {
        res.send({ 
      	  msg: 'Errors have occurred :(', 
      	  errors: errors.Array(),
        });
      }
      post.title = req.body.title;
      post.content = req.body.content;
      post.save((err) => {
      	if (err) return next(err);
      	res.send(post);
      })
    });
    
  }
]

exports.post_delete = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Post.findById(req.params.postId)
      .exec((err, post) => {
        if (err) return next(err);
        if (post == null) {
          const err = new Error('Post not found');
          err.status = 404;
          return next(err);
        }
        if (req.user._id.toString() != post.author.toString()) {
          res.send({ msg: 'You aren\'t authorized to delete this post' });
          return;
        }
      }) 
    Post.findByIdAndRemove(req.params.postId, (err) => {
      if (err) return next(err);
      res.send({ msg: `Post ${req.params.postId} deleted` });
    })
  }
]

exports.post_publish = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
  	Post.findById(req.params.postId)
  	  .exec((err, post) => {
  	  	if (err) return next(err);
  	  	post.published = true;
  	  	post.published_at = Date.now();
  	  	post.save((err) => {
  	  	  if (err) return next(err);
  	  	  res.send(post);
  	  	});
  	  })
  }
]

exports.post_unpublish = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
  	Post.findById(req.params.postId)
  	  .exec((err, post) => {
  	  	if (err) return next(err);
  	  	post.published = false;
  	  	post.published_at = null;
  	  	post.save((err) => {
  	  	  if (err) return next(err);
  	  	  res.send(post);
  	  	});
  	  })
  }
]