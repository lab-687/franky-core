const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupParticipantsSchema = new Schema({role: String, userId: String});

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  participants: {
    type: [groupParticipantsSchema],
    required: true
  },
  stories: {
    type: [String],
    required: false
  },
  categories: {
    type: [String],
    required: false
  },
  events: {
    type: [String],
    required: false
  },
  type: {
    type: String,
    required: true
  }
});

const Groups = mongoose.model('Groups', schema);
Groups.createIndexes();

module.exports = Groups;
