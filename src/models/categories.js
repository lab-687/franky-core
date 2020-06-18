const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
});

const Categories = mongoose.model('Categories', schema);
Categories.createIndexes();

module.exports = Categories;
