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

exports.comment_create = (req, res, next) => {
  
}