const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

const Users = mongoose.model('Users', schema);
Users.createIndexes();

module.exports = Users;
