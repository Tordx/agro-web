"use strict";

const internals = {};
const { Users, Insurances } = require("@models");

internals.index = async function (req, reply) {
  const farmers = await Insurances.find({ status: "accepted" }).populate("eventId farmerId").lean();
  reply.view("technician/acceptedInsurance/index.html", { credentials: req.auth.credentials, farmers });
};

module.exports = internals;
