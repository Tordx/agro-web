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
    path: "/admin/stock-in",
    handler: Handlers.index,
  },
  {
    method: ["POST"],
    path: "/admin/stock-in/add-product",
    handler: Handlers.addProduct,
  },
  {
    method: ["POST"],
    path: "/admin/stock-in/add-stocks",
    handler: Handlers.addStocks,
  },
  {
    method: ["POST"],
    path: "/admin/stock-in/update-product",
    handler: Handlers.updateProduct,
  },
  {
    method: ["POST"],
    path: "/admin/stock-in/delete-product/{product_id}",
    handler: Handlers.deleteProduct,
  },
];

internals.endpoints = endpoints.map((r) => {
  if (!!r.config) r.config = { ...CONFIG, ...r.config };
  else r.config = { ...CONFIG };
  return r;
});

module.exports = internals;
