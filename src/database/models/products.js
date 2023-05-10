"use strict";

const Mongoose = require("mongoose");
const ObjectId = Mongoose.Schema.Types.ObjectId;
const Schema = Mongoose.Schema;

const productsSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    qty: { type: Number },
  },
  {
    timestamps: true,
    _id: true,
  }
);

const _schema = Mongoose.model("products", productsSchema);

module.exports = _schema;
