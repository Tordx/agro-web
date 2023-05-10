"use strict";

const internals = {};
const { Users, Events } = require("@models");

internals.dashboard = async function (req, reply) {
  return reply.redirect('/farmer/announcements')
  
  //Get event list
  let start = new Date();
  start.setHours(0, 0, 0, 0);
  const eventsList = await Events.find({ endDate: { $gte: start } })
    .sort({ startDate: -1 })
    .lean();

  reply.view("farmer/dashboard.html", {
    credentials: req.auth.credentials,
    eventsList,
  });
};

module.exports = internals;
