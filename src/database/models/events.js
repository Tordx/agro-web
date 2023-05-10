"use strict";

const Mongoose = require("mongoose");
const ObjectId = Mongoose.Schema.Types.ObjectId;
const Schema = Mongoose.Schema;

const eventSchema = new Mongoose.Schema(
  {
    picture: { type: String, required: false },
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  {
    timestamps: true,
    _id: true,
  }
);

const _schema = Mongoose.model("events", eventSchema);

module.exports = _schema;
