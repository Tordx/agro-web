"use strict";

const internals = {};
const { Users } = require("@models");
const Image = require("@lib/Image");

internals.index = async function (req, reply) {
  const farmers = await Users.find({ scope: "farmer", "farm.status": "pending" }).lean();
  reply.view("technician/dashboard/index.html", { credentials: req.auth.credentials, farmers: farmers });
};

internals.acceptedFarmerList = async function (req, reply) {
  const farmers = await Users.find({ scope: "farmer", "farm.status": "accepted" }).sort({ approve_date: -1 }).lean();

  reply.view("technician/dashboard/index.html", { credentials: req.auth.credentials, farmers });
};

internals.updateFarmer = async function (req, reply) {
  const { status, farmerId } = req.payload;
  await Users.updateOne({ _id: farmerId }, { $set: { "farm.status": status, approve_date: new Date() } });
  return reply({ message: `sucessfully ${status}`, type: "success" });
};

module.exports = internals;
