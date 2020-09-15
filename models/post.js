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
  	// with PostSchema.add({ })
  	//published_at: { type: Date },
  	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  }
);

PostSchema
  .virtual('created_at_formatted')
  .get(() => {
  	return this.created
  });

module.exports = mongoose.model('Post', PostSchema);