const async = require('async');
const Post = require('../models/post');
const Comment = require('../models/comment');
const validator = require('express-validator');

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

exports.post_create_get = (req, res, next) => {
  
}

exports.post_create_post = (req, res, next) => {
  
}

exports.post_update_get = (req, res, next) => {
  
}

exports.post_update_post = (req, res, next) => {
  
}

exports.post_delete = (req, res, next) => {
  
}