"use strict";

const Mongoose = require("mongoose");
const ObjectId = Mongoose.Schema.Types.ObjectId;
const Schema = Mongoose.Schema;

const stocksSchema = new Mongoose.Schema(
  {
    product_id: { type: ObjectId, ref: "products", required: true },
    qty: { type: Number },
  },
  {
    timestamps: true,
    _id: true,
  }
);

const _schema = Mongoose.model("stocks", stocksSchema);

module.exports = _schema;
