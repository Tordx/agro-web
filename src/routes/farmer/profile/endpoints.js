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
    path: "/farmer/profile",
    handler: Handlers.profile,
  },
  {
    method: ["POST"],
    path: "/farmer/profile/update",
    handler: Handlers.update
  },
  {
    method: ["POST"],
    path: "/farmer/profile/upload",
    handler: Handlers.upload,
  },
];

internals.endpoints = endpoints.map((r) => {
  if (!!r.config) r.config = { ...CONFIG, ...r.config };
  else r.config = { ...CONFIG };
  return r;
});

module.exports = internals;
