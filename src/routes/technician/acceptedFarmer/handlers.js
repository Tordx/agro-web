"use strict";

const internals = {};
const { Users } = require("@models");

internals.index = async function (req, reply) {
  console.log(req.auth.credentials);
  const technician = await Users.findOne({ _id: req.auth.credentials.id, scope: "technician" }).lean();
  const barangay = technician ? req.auth.credentials.barangay : null;
  console.log(barangay);
  const farmers = await Users.find({ scope: "farmer", "farm.status": "accepted" }).sort({ approve_date: -1 }).lean(); 
  console.log(farmers);
  reply.view("technician/acceptedFarmer/index.html", { credentials: req.auth.credentials, farmers });
};

module.exports = internals;