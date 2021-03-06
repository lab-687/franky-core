const mongoose = require('mongoose');
const Users = require('../models/users');

exports.list = async (filter, show) => {
    const res = await Users.find(filter, show);
    return res;
};

exports.create = async data => {
    const user = new Users(data);
    await user.save();
};

exports.update = async (id, data) => {
  await Users.findByIdAndUpdate(id, {
    $set: data
  });
};

exports.delete = async (id) => {
  await Users.findByIdAndDelete(id);
};
