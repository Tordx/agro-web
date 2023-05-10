"use strict";

const internals = {};
const { Users, Events } = require("@models");

internals.index = async function (req, reply) {
  let start = new Date();
  start.setHours(0, 0, 0, 0);
  const events = await Events.find({ endDate: { $gte: start } })
    .sort({ startDate: -1 })
    .lean();

  reply.view("technician/events/index.html", { credentials: req.auth.credentials, events });
};
module.exports = internals;
