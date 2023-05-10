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
    scope: "technician",
  },
  tags: ["api"],
};

const endpoints = [
  {
    method: ["GET"],
    path: "/technician/dashboard",
    handler: Handlers.index,
  },
  {
    method: ["POST"],
    path: "/technician/update-farmer-status",
    handler: Handlers.updateFarmer,
  },
];

internals.endpoints = endpoints.map((r) => {
  if (!!r.config) r.config = { ...CONFIG, ...r.config };
  else r.config = { ...CONFIG };
  return r;
});

module.exports = internals;
