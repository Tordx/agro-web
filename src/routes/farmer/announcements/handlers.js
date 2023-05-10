"use strict";

const internals = {};
const { Announcements, Insurances } = require("@models");
const { isEmpty } = require("lodash");

internals.announcements = async function (req, reply) {
  const announcements = await Announcements.find({
    createdAt: {
      $gte: new Date(),
      $lt: new Date(),
    },
  })
    .sort({ createdAt: "desc" })
    .lean();

  reply.view("farmer/announcements.html", {
    credentials: req.auth.credentials,
    announcements,
    hasAnnouncements: announcements?.length > 0,
  });
};

internals.apply_insurance = async (req, reply) => {
  try {
    const {
      eventId,
      firstName,
      middleName,
      lastName,
      gender,
      civilStatus,
      address,
      birthday,
      phoneNumber,
      beneficiary,
      amountOfCover,
      sowing,
      tp,
      harvest,
      varity,
    } = req.payload;

    const hasDuplicateEntry = await Insurances.find({
      farmerId: req.auth.credentials?._id,
      status: { $in: ["pending", "accepted"] },
    });

    if (!isEmpty(hasDuplicateEntry)) {
      return reply.redirect("/farmer/events?message=You have duplicate application for this entry.&alert=error");
    }

    await Insurances.create({
      eventId,
      farmerId: req.auth.credentials?._id,
      status: "pending",

      firstName,
      middleName,
      lastName,
      gender,
      civilStatus,
      address,
      birthday,
      phoneNumber,
      beneficiary,
      amountOfCover,
      sowing,
      tp,
      harvest,
      varity,
    });

    reply.redirect("/farmer/events?message=Applied successfully!&alert=success");
  } catch (err) {
    reply.redirect("/farmer/events?message=Problem occurred!&alert=error");
  }
};

module.exports = internals;
