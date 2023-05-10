"use strict";

var internals = {};
const { Users, Sales, Stocks } = require("@models");
const { isNil } = require("lodash");
const _ = require("lodash");
const mongoose = require("mongoose");

internals.index = async function (req, reply) {
  const farmerTotal = await Users.countDocuments({ scope: "farmer" });
  const technicianTotal = await Users.countDocuments({ scope: "technician" });
  const adminTotal = await Users.countDocuments({ scope: "admin" });
  const pendingFarmerApplicants = await Users.find({ scope: "farmer", "farm.status": "pending" }).lean();

  return reply.view("admin/dashboard.html", {
    credentials: req.auth.credentials,
    memberTotal: { farmer: farmerTotal || 0, technician: technicianTotal || 0, admin: adminTotal || 0 },
    pendingFarmerApplicants,
  });
};

internals.farmer_status_update = async (req, reply) => {
  const { id, status } = req.params;
  await Users.findByIdAndUpdate(id, { $set: { 'farm.status': status } });
  return reply({
    status: true,
    message: `Successfully ${status}`,
    icon: "success",
  });
};

module.exports = internals;
