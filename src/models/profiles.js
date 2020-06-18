const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userPropertiesSchema = new Schema({type: String, value: String});

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  profilePicture: {
    type: String,
    required: false
  },
  userProperties: {
    type: [userPropertiesSchema],
    required: false
  },
  userGroups: {
    type: [String],
    required: false
  },
  userEvents: {
    type: [String],
    required: false
  }
});

const Profiles = mongoose.model('Profiles', schema);
Profiles.createIndexes();

module.exports = Profiles;
