"use strict";

const Mongoose = require("mongoose");
const ObjectId = Mongoose.Schema.Types.ObjectId;
const Schema = Mongoose.Schema;

const insuranceSchema = new Mongoose.Schema(
  {
    eventId: { type: ObjectId, ref: "events", required: true },
    farmerId: { type: ObjectId, ref: "users", required: true },
    status: { type: String, default: "pending" }, //accepted/declined/peding
    approve_date: { type: Date },

    firstName: { type: String },
    lastName: { type: String },
    middleName: { type: String },
    gender: { type: String },
    civilStatus: { type: String },
    address: { type: String },
    birthday: { type: String },
    phoneNumber: { type: String },
    beneficiary: { type: String },
    amountOfCover: { type: String },
    sowing: { type: String },
    tp: { type: String },
    harvest: { type: String },
    varity: { type: String },
  },
  {
    timestamps: true,
    _id: true,
  }
);

const _schema = Mongoose.model("insurances", insuranceSchema);

module.exports = _schema;
