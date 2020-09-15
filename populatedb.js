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

const postCreate = () => {

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

async.series([
  createUsers,
], function(err, results) {
	 if (err) {
	 	console.log('FINAL ERR: ' + err);
	 } else {
	 	console.log('Results: ' + results)
	 }
     mongoose.connection.close();
   }
);

