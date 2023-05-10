"use strict";
/**
 * ## Imports
 *
 */
//Handle the endpoints
var Handlers = require("./handlers"),
  internals = {};

const CONFIG = {
  auth: {
    strategy: "standard",
    scope: "farmer",
  },
  tags: ["api"],
};

const endpoints = [
  {
    method: ["GET"],
    path: "/farmer/announcements",
    handler: Handlers.announcements,
  },
  {
    method: ["POST"],
    path: "/farmer/apply-insurance",
    handler: Handlers.apply_insurance,
  },
];

internals.endpoints = endpoints.map((r) => {
  if (!!r.config) r.config = { ...CONFIG, ...r.config };
  else r.config = { ...CONFIG };
  return r;
});

module.exports = internals;
