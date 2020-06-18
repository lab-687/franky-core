const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  usersTypeAllowed: {
    type: String,
    required: true
  },
  canUsersMakeStories: {
    type: Boolean,
    required: true
  },
  canUsersMakeGroups: {
    type: Boolean,
    required: true
  },
  hasGroups: {
    type: Boolean,
    required: true
  },
  hasCategories: {
    type: Boolean,
    required: true
  },
  hasEvents: {
    type: Boolean,
    required: true
  },
  canUsersMakeEvents: {
    type: Boolean,
    required: true
  }
});

const Environment = mongoose.model('Environment', schema);
Environment.createIndexes();

module.exports = Environment;
