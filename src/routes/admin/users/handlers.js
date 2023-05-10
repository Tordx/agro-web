"use strict";

var internals = {};
const { Users } = require("@models");
const Crypto = require("@lib/Crypto");

internals.index = async function (req, reply) {
  const users = await Users.find({ scope: { $ne: "admin" } }).lean();

  return reply.view("admin/users.html", {
    credentials: req.auth.credentials,
    users: users?.map((v) => ({
      ...v,
      commonity: v?.farm?.commonity?.join(","),
      species: v?.farm?.species?.join(","),
    })),
  });
};

internals.add = async function (req, reply) {
  try {
    await Users.create(req.payload);
    return reply.redirect("/admin/users?message=Successfully Created&alert=success");
  } catch (error) {
    return reply.redirect("/admin/users?message=Error Please try again!&alert=error");
  }
};

internals.update = async function (req, reply) {
  let payload = {
    email: req.payload.email,
  };
  if (req.payload.password) {
    payload.password = Crypto.encrypt(req.payload.password);
  }
  const user = await Users.findOneAndUpdate(
    {
      _id: req.payload._id,
    },
    { $set: payload }
  ).lean();
  if (!user) {
    return reply.redirect("/admin/users?message=Error to update&alert=error");
  }
  return reply.redirect("/admin/users?message=Successfully Updated&alert=success");
};

internals.delete = async function (req, reply) {
  const user = await Users.remove({
    _id: req.params._id,
  }).lean();
  if (!user) {
    return reply({ status: false, message: "Error to delete", icon: "fail" });
  }
  return reply({ status: true, message: "Successfully deleted", icon: "success" });
};
module.exports = internals;
