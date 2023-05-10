"use strict";

var internals = {};
const { Products } = require("@models");
const { isNil } = require("lodash");
const _ = require("lodash");
const mongoose = require("mongoose");

internals.index = async function (req, reply) {
  const products = await Products.find({}).lean();

  return reply.view("admin/stockin.html", { credentials: req.auth.credentials, products });
};

internals.addProduct = async function (req, reply) {
  const { name, type, qty } = req.payload;

  await Products.create({ name, type, qty });

  reply.redirect("/admin/stock-in?message=Product successfully added!&alert=success");
};

internals.addStocks = async function (req, reply) {
  let { product_id, qty } = req.payload;

  if (!qty) qty = 0;
  let product = await Products.findOne({ _id: product_id });
  if (!product?.qty) product.qty = 0;
  product = await Products.findOneAndUpdate({ _id: product_id }, { qty: product.qty + parseInt(qty) }, { new: true });

  reply.redirect("/admin/stock-in?message=Stocks successfully added!&alert=success");
};

internals.updateProduct = async function (req, reply) {
  const { product_id, name, type, qty } = req.payload;

  await Products.findOneAndUpdate({ _id: product_id }, { name, type, qty }, { new: true });

  reply.redirect("/admin/stock-in?message=Update successfully added!&alert=success");
};

internals.deleteProduct = async function (req, reply) {
  const { product_id } = req.params;

  let product = await Products.findOne({ _id: product_id });

  if (product?.qty > 0)
    return reply({
      status: false,
      message: "Product has stocks",
      icon: "error",
    });

  await Products.deleteOne({ _id: product_id });

  return reply({
    status: true,
    message: "Successfully deleted",
    icon: "success",
  });
};
module.exports = internals;
