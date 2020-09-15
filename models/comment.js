const moment = require('moment');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    content: { type: String, require: true, maxLength: 140 },
    created_at: { type: Date, default: Date.now() },
    post: { type: Schema.Types.ObjectId, ref: 'Post', require: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', require: true },
  }
);