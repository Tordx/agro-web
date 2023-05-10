"use strict";

var internals = {};
const { Products, Stocks } = require("@models");
const { isNil } = require("lodash");
const _ = require("lodash");
const mongoose = require("mongoose");

internals.index = async function (req, reply) {
  const stocks = await Stocks.find({}).populate("product_id").lean();
  const products = await Products.find({}).lean();

  return reply.view("admin/stockOut.html", { credentials: req.auth.credentials, products, stocks });
};

internals.addStocks = async function (req, reply) {
  let { product_id, qty } = req.payload;
  let stockQty = qty ? qty : 0;
  product_id = product_id.split("-");
  product_id = product_id[0];

  qty = qty ? qty : 0;

  const product = await Products.findOne({ _id: product_id }).lean();
  product.qty = product.qty ? product.qty : 0;

  qty = parseInt(product.qty) - parseInt(qty);
  qty = qty ? qty : 0;

  await Products.findOneAndUpdate({ _id: product }, { qty }, { new: true });

  await Stocks.create({ product_id, qty: parseInt(stockQty) });

  reply.redirect("/admin/stock-out?message=Stocks successfully added!&alert=success");
};
module.exports = internals;
