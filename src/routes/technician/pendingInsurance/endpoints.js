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
    path: "/technician/insurance-pending",
    handler: Handlers.index,
  },
  {
    method: ["POST"],
    path: "/technician/update-insurance-status",
    handler: Handlers.updateFarmerInsuranceStatus,
  },
];

internals.endpoints = endpoints.map((r) => {
  if (!!r.config) r.config = { ...CONFIG, ...r.config };
  else r.config = { ...CONFIG };
  return r;
});

module.exports = internals;
