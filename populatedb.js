require('dotenv').config();

const passwordMethods = require('./helpers/password.js');

console.log('populating db :O');

const async = require('async');
const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');

const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

const users = [];
const posts = [];
const comments = [];

const userCreate = (username, password, cb) => {
  const saltHash = passwordMethods.genPassword(password);
  const user = new User({
    username,
    salt: saltHash.salt,
    hash: saltHash.hash,
  });

  user.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New User: ' + user);
    users.push(user);
    cb(null, user);
    return;
  });
};

const postCreate = (title, content, author, cb) => {
  const post = new Post ({
  	title,
  	content,
  	author,
  });

  post.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Post: ' + post);
    posts.push(post);
    cb(null, post);
    return;
  });
};

const createUsers = (cb) => {
  async.series([
    function(callback) {
      userCreate('Kingston', 'Kingston', callback);
    },
    function(callback) {
      userCreate('Girlpool', 'Girlpool', callback);
    }
  ], cb);
};

const createPosts = (cb) => {
  async.series([
    function(callback) {
      postCreate('field trip', 'oh shit there\'s a field trip today', users[0], callback);
    },
    function(callback) {
      postCreate('tomatoes', 'i love tomatoes', users[0], callback);
    },
    function(callback) {
      postCreate('grape soda', 'where can I get some grape soda', users[1], callback);
    },
    function(callback) {
      postCreate('table cloth', 'table cloths?', users[1], callback);
    },
  ], cb);
};

async.series([
  createUsers,
  createPosts,
], function(err, results) {
	 if (err) {
	 	console.log('FINAL ERR: ' + err);
	 } else {
	 	console.log('Results: ' + results)
	 }
     mongoose.connection.close();
   }
);

