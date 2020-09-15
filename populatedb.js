require('dotenv').config();

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

