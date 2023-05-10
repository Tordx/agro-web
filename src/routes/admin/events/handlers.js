"use strict";

var internals = {};
const { Users, Sales, Stocks, Events, Insurances } = require("@models");
const { isNil } = require("lodash");
const _ = require("lodash");
const mongoose = require("mongoose");
const Image = require("@lib/Image");

internals.index = async function (req, reply) {
  try {
    const events = await Events.find({}).lean();
    const insuranceApplicants = await Insurances.find({ status: "pending" }).populate("farmerId").lean();
    const eventsWithApplicants = events?.map((v) => {
      const applicantData = insuranceApplicants.filter((e) => String(v?._id) == String(e?.eventId));
      if (applicantData?.length > 0) {
        v.insuranceApplicants = applicantData;
      }
      return v;
    });

    return reply.view("admin/events.html", {
      credentials: req.auth?.credentials,
      message: req.query?.message,
      alert: req.query?.alert,
      events: eventsWithApplicants,
    });
  } catch (err) {
    console.log("ERRR", err);
  }
};

internals.add_event = async (req, reply) => {
  try {
    const payload = (({ picture, ...others }) => others)(req.payload);

    const data = await Events.create(payload);
    Image.upload(req.payload.picture, data?._id);
    await Events.findByIdAndUpdate(data?._id, {
      $set: { picture: `/assets/images/insurance/${data?._id}.jpg` },
    });
    reply.redirect("/admin/events?message=Event successfully added!&alert=success");
  } catch (error) {
    reply.redirect("/admin/events?message=Internal error!&alert=error");
  }
};

internals.update_event = async (req, reply) => {
  try {
    const payload = (({ picture, _id, ...others }) => others)(req.payload);

    // REMOVE EMPTY DATA
    Object.keys(payload).forEach((v) => {
      if (_.isEmpty(payload[v])) delete payload[v];
    });

    await Events.findByIdAndUpdate(req.payload?._id, {
      $set: { ...payload },
    });

    if (!_.isNil(req.payload?.picture)) {
      Image.upload(req.payload.picture, req.payload?._id);
      await Events.findByIdAndUpdate(req.payload?._id, {
        $set: { picture: `/assets/images/insurance/${req.payload?._id}.jpg` },
      });
    }

    reply.redirect("/admin/events?message=Event successfully added!&alert=success");
  } catch (err) {
    reply.redirect("/admin/events?message=Internal error!&alert=error");
  }
};

internals.remove_event = async (req, reply) => {
  try {
    const { id } = req.params;
    console.log("CAMER HARER");
    await Events.findByIdAndRemove(id);
    return reply({
      status: true,
      message: "Successfully deleted",
      icon: "success",
    });
  } catch (err) {
    return reply({
      status: false,
      message: "Error",
      icon: "error",
    });
  }
};

internals.insurance_update = async (req, reply) => {
  try {
    const { id, status } = req.params;
    if (!["declined", "accepted"].includes(status)) {
      return reply.redirect(`/admin/events?message=Invalid status!&alert=error`);
    }
    await Insurances.findByIdAndUpdate(id, { $set: { status } });
    reply.redirect(`/admin/events?message=Successfully ${status}!&alert=success`);
  } catch (err) {
    reply.redirect("/admin/events?message=Internal error!&alert=error");
  }
};

module.exports = internals;
