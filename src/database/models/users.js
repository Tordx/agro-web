"use strict";

const Crypto = require("@lib/Crypto");
const Mongoose = require("mongoose");
const ObjectId = Mongoose.Schema.Types.ObjectId;
const Schema = Mongoose.Schema;

const farmerSchema = new Schema(
  {
    status: { type: String, default: "pending" }, // (accepted/declined/pending)
    farm_address: Object, // (farm location, land category, area, tenurial status)
    commonity: Array,
    species: Array,
    approve_date: { type: Date },

    civilStatus: { type: String },
    phoneNumber: { type: String },
    municipality: { type: String },
    region: { type: String },
    barangay: { type: String },

    farmArea: { type: String },
    hectares: { type: String },
    registeredOwner: { type: String, default: "registered owner" },
    farmersSelected: { type: String },
    farmWorkerSelected: { type: String },
  },
  {
    _id: false,
  }
);

const userSchema = new Mongoose.Schema(
  {
    profile_img: { type: String, default: "/assets/images/profile/profile.jpg" },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    birthday: { type: Date, required: true },
    gender: { type: String, required: true },

    scope: { type: String, default: "farmer" }, // (admin, technician, farmer)
    farm: farmerSchema, // for farmer only
  },
  {
    timestamps: true,
    _id: true,
  }
);

userSchema.pre("save", function (next) {
  this.password = Crypto.encrypt(this.password);
  next();
});

const _schema = Mongoose.model("users", userSchema);

module.exports = _schema;
