"use strict";

var internals = {};
const { Users, Sales, Stocks, Announcements } = require("@models");
const { isNil } = require("lodash");
const _ = require("lodash");
const mongoose = require("mongoose");
const Image = require("@lib/Image");

internals.index = async function (req, reply) {
  const announcements = await Announcements.find({}).populate("author").lean();

  return reply.view("admin/announcements.html", {
    credentials: req.auth.credentials,
    announcements,
  });
};

internals.add = async (req, reply) => {
  try {
    const data = await Announcements.create({
      description: req.payload.description,
      author: req.auth.credentials._id,
    });
    Image.upload(req.payload.picture, data._id);
    await Announcements.updateOne({ _id: data._id }, { $set: { picture: `/assets/images/insurance/${data._id}.jpg` } });

    return reply.redirect("/admin/announcements?message=Successfully added&alert=success");
  } catch (error) {
    return reply.redirect("/admin/announcements?message=Problem occured&alert=error");
  }
};

internals.update = async (req, reply) => {
  try {
    const payload = { ...req.payload };
    if (_.isEmpty(payload.picture) == false) {
      Image.upload(payload.picture, req.params._id);
      payload.picture = `/assets/images/insurance/${req.params.id}.jpg`;
    } else {
      delete payload.picture;
    }

    await Announcements.updateOne({ _id: req.params.id }, { $set: payload });
    return reply.redirect("/admin/announcements?message=Update successfully!&alert=success");
  } catch (error) {
    return reply.redirect("/admin/announcements?message=Update error!&alert=error");
  }
};

internals.delete = async (req, reply) => {
  await Announcements.findByIdAndRemove(req.params.id);
  return reply({
    status: true,
    message: "Successfully deleted",
    icon: "success",
  });
};

module.exports = internals;
