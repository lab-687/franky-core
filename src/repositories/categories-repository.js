const mongoose = require('mongoose');
const Categories = require('../models/categories');

exports.list = async (filter, show) => {
    const res = await Categories.find(filter, show);
    return res;
};

exports.create = async data => {
    const user = new Categories(data);
    await user.save();
};

exports.delete = async (id) => {
    await Categories.findByIdAndDelete(id);
};
