const mongoose = require('mongoose');
const Profiles = require('../models/profiles');

exports.show = async (filter, show) => {
    const res = await Profiles.find(filter, show);
    return res;
};

exports.create = async data => {
    const user = new Profiles(data);
    await user.save();
};

exports.update = async (id, data) => {
  await Profiles.findByIdAndUpdate(id, {
    $set: data
  });
};
