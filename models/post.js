const moment = require('moment');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
  	title: { type: String, require: true, maxLength: 90 },
  	content: { type: String, require: true },
  	created_at: { type: Date, default: Date.now() },
  	published: { type: Boolean, default: false },
  	// add when post is published
  	published_at: { type: Date, default: null },
  	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  }
);

PostSchema
  .virtual('created_at_formatted')
  .get(() => {
  	return this.created_at ? moment(this.created_at).format('MMM Do, YYYY') : 'unknown'
  });

PostSchema
  .virtual('created_at_formatted')
  .get(() => {
    return this.published_at ? moment(this.published_at).format('MMM Do, YYYY') : 'unknown'
  });

module.exports = mongoose.model('Post', PostSchema);