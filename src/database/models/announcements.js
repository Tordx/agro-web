'use strict';

const Mongoose = require('mongoose');
const ObjectId = Mongoose.Schema.Types.ObjectId;
const Schema = Mongoose.Schema;

const announcementSchema = new Mongoose.Schema(
  {
    picture: String,
    description: { type: String, required: true },
    author: { type: ObjectId, ref: 'users', required: true },
  },
  {
    timestamps: true,
    _id: true,
  }
);

const _schema = Mongoose.model('announcements', announcementSchema);

module.exports = _schema;
