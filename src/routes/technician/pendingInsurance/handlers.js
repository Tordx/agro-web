"use strict";

const internals = {};
const { Users, Insurances } = require("@models");

internals.index = async function (req, reply) {
  const farmers = await Insurances.find({ status: "pending" }).populate("eventId farmerId").lean();
  reply.view("technician/pendingInsurance/index.html", { credentials: req.auth.credentials, farmers });
};

internals.updateFarmerInsuranceStatus = async function (req, reply) {
  const { status, insuranceId } = req.payload;
  await Insurances.updateOne({ _id: insuranceId }, { $set: { status: status, approve_date: new Date() } });
  return reply({ message: `sucessfully ${status}`, type: "success" });
};
module.exports = internals;
