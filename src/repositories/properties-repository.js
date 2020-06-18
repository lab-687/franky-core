const mongoose = require('mongoose');
const Properties = require('../models/properties');

exports.list = async (filter, show) => {
    const res = await Properties.find(filter, show);
    return res;
};

exports.create = async data => {
    const user = new Properties(data);
    await user.save();
};

exports.delete = async (id) => {
    await Properties.findByIdAndDelete(id);
};
