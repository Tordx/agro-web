"use strict";
/**
 * ## Imports
 *
 */
//Handle the endpoints
var Handlers = require("./handlers"),
  internals = {};

const CONFIG = {
  tags: ["api"],
};

const endpoints = [
  {
    method: ["GET"],
    path: "/",
    handler: Handlers.index,
  },
  {
    method: ["GET"],
    path: "/login",
    handler: Handlers.login,
  },
  {
    method: ["POST"],
    path: "/signup",
    handler: Handlers.signup,
  },
  {
    method: ["GET"],
    path: "/logout",
    handler: Handlers.logout,
  },
  {
    method: ["POST"],
    path: "/web/authentication",
    handler: Handlers.web_authentication,
  },
  {
    method: ["POST"],
    path: "/account-password-reset",
    handler: Handlers.password_reset,
  },
  {
    method: ["GET"],
    path: "/account-recovery/{code}",
    handler: Handlers.account_recovery,
  },
];

internals.endpoints = endpoints.map((r) => {
  if (!!r.config) r.config = { ...CONFIG, ...r.config };
  else r.config = { ...CONFIG };
  return r;
});

module.exports = internals;
