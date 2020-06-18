const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  type: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  expressionValidate: {
    type: String,
    required: false
  }
});

const Properties = mongoose.model('Properties', schema);
Properties.createIndexes();

module.exports = Properties;
