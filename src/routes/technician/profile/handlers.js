"use strict";

const internals = {};
const Image = require("@lib/Image");
const Crypto = require("@lib/Crypto");
const { Users } = require("@models");
const _ = require("lodash");

internals.profile = async (req, reply) => {
  const credentials = await Users.findById(req.auth.credentials._id).lean();

  reply.view("technician/profile/profile.html", {
    credentials,
  });
};

internals.update = async function (req, reply) {
  try {
    const payload = {
      firstname: req.payload.firstname,
      lastname: req.payload.lastname,
      password: Crypto.encrypt(req.payload?.password),
    };

    if (_.isEmpty(req.payload?.password)) delete payload.password;

    await Users.updateOne(
      {
        _id: req.auth.credentials._id,
      },
      {
        $set: payload,
      }
    );

    return reply.redirect("/technician/profile?message=Successfully update&alert=success");
  } catch (error) {
    return reply.redirect("/technician/profile?message=Error to udpdate&alert=error");
  }
};

internals.upload = async function (req, reply) {
  Image.uploadUser(req.payload.img, req.auth.credentials._id);
  await Users.update(
    { _id: req.auth.credentials._id },
    {
      $set: {
        profile_img: `/assets/images/profile/${req.auth.credentials._id}.jpg`,
      },
    }
  );
  return reply.redirect("/technician/profile?message=Successfully update&alert=success");
};

module.exports = internals;
