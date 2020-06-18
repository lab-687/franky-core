const mongoose = require('mongoose');
const Groups = require('../models/groups');

exports.list = async (filter, show) => {
    const res = await Groups.find(filter, show);
    return res;
};

exports.findByUser = async (groups) => {

};

exports.create = async data => {
    const user = new Groups(data);
    await user.save();
};

exports.update = async (id, data) => {
  await Groups.findByIdAndUpdate(id, {
    $set: data
  });
};

exports.delete = async (id) => {
  await Groups.findByIdAndDelete(id);
};
