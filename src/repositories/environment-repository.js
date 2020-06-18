const mongoose = require('mongoose');
const Environment = require('../models/environment');

exports.show = async (filter, show) => {
    const res = await Environment.find(filter, show);
    return res;
};

exports.create = async data => {
    const user = new Environment(data);
    await user.save();
};

exports.update = async (id, data) => {
  await Environment.findByIdAndUpdate(id, {
    $set: data
  });
};
