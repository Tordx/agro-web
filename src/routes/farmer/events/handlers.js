"use strict";

const internals = {};
const { Users, Events } = require("@models");

internals.events = async function (req, reply) {
  const events = await Events.find({}).sort({ createdAt: 'desc' }).lean()

  reply.view("farmer/events.html", {
    credentials: req.auth.credentials,
    events,
  });
};

module.exports = internals;
