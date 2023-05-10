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
    scope: "admin",
  },
  tags: ["api"],
};

let endpoints = [
  {
    method: ["GET"],
    path: "/admin/events",
    handler: Handlers.index,
  },
  {
    method: ["POST"],
    path: "/admin/add/events",
    handler: Handlers.add_event,
  },
  {
    method: ["POST"],
    path: "/admin/update/events",
    handler: Handlers.update_event,
  },
  {
    method: ["POST"],
    path: "/admin/remove/events/{id}",
    handler: Handlers.remove_event,
  },
  {
    method: ["GET"],
    path: "/admin/insurance-upate/{id}/{status}",
    handler: Handlers.insurance_update,
  },
];

internals.endpoints = endpoints.map((r) => {
  if (!!r.config) r.config = { ...CONFIG, ...r.config };
  else r.config = { ...CONFIG };
  return r;
});

module.exports = internals;
