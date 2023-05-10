"use strict";

var internals = {},
  _ = require("lodash");
var Crypto = require("@lib/Crypto");
const { Users } = require("@models");
const Image = require("@lib/Image");

internals.index = async function (req, reply) {
  let farmers = await Users.find({
    scope: "farmer",
  }).lean();

  return reply.view("admin/farmers.html", {
    farmers,
  });
};
module.exports = internals;
