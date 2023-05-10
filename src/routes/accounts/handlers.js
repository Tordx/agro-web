"use strict";

var internals = {};
const { last, isNil } = require("lodash");
const _ = require("lodash");
const Crypto = require("@lib/Crypto");
const crypto = require("crypto");
const { Users, Settings, Links } = require("@models");
const Nodemailer = require("nodemailer");
const Image = require("@lib/Image");

const transporter = Nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jeza.oyao28@gmail.com",
    pass: "gvvqfjnszfoubkaj",
  },
});

const resetPassword = (email, userID) => {
  const payload = {};
  payload.code = crypto.randomBytes(40).toString("hex");
  payload.userID = userID;

  const code = new Links(payload);
  code.save(function (err, user) {
    if (err) {
      console.log(err);
    } else {
      var mailOptions = {
        from: `"AGRO" ${"jeza.oyao28@gmail.com"}`,
        to: email,
        subject: "Password Reset",
        text: "Click this link to reset your password " + `http://localhost:8080/account-recovery/${payload.code}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("MAIL-ERROR", error);
          return {
            success: false,
          };
        } else {
          console.log("Email sent: " + info.response);
          return {
            success: true,
          };
        }
      });
    }
  });
};

internals.index = async function (req, reply) {
  req.cookieAuth.clear();
  return reply.view("accounts/login.html");
};

internals.login = async function (req, reply) {
  req.cookieAuth.clear();
  if (isNil(req.query?.email) === false) {
    const validEmail = await Users.findOne({ email: req.query.email }).lean();
    if (!validEmail) return reply.redirect("/?message=Invalid email&alert=error");
    else {
      resetPassword(req.query.email, validEmail._id);
      return reply.redirect(`/?message=Link successfully sent to ${req.query.email}&alert=success`);
    }
  }

  return reply.view("accounts/login.html", {
    email: req.query.email,
    message: req.query.message,
    alert: req.query.alert,
  });
};

internals.signup = async (req, reply) => {
  try {
    console.log(req.payload);
    let {
      username,
      password,
      confirm_password,
      firstname,
      lastname,
      address,
      gender,
      birthday,
      farm_address,
      commonity,
      species,

      civilStatus,
      phoneNumber,
      municipality,
      region,
      barangay,

      farmArea,
      hectares,

      registeredOwner,
      registeredOwner2,

      rice,
      corn,
      forFarmerOthers,
      harvesting,
      landPreparation,
      farmWorkerOthers,
    } = req.payload;

    let farmersSelected = "";
    if (rice) farmersSelected = rice;
    if (corn) farmersSelected = farmersSelected + "," + corn;
    if (forFarmerOthers) farmersSelected = farmersSelected + "," + forFarmerOthers;

    let farmWorkerSelected = "";
    if (harvesting) farmWorkerSelected = harvesting;
    if (landPreparation) farmWorkerSelected = farmWorkerSelected + "," + landPreparation;
    if (farmWorkerOthers) farmWorkerSelected = farmWorkerSelected + "," + farmWorkerOthers;

    const payload = {
      email: username,
      username,
      password,
      confirm_password,
      firstname,
      lastname,
      address,
      gender,
      birthday,
      farm: {
        status: "pending",
        commonity: JSON.parse(commonity).map((v) => v.value),
        species: JSON.parse(species).map((v) => v.value),
        farm_address: farm_address,

        civilStatus,
        phoneNumber,
        municipality,
        region,
        barangay,
        farmArea,
        hectares,
        registeredOwner: registeredOwner ? registeredOwner : registeredOwner2,
        farmersSelected,
        farmWorkerSelected,
      },
    };
    const data = await Users.create(payload);
    if (!_.isEmpty(req.payload?.profile_img)) {
      Image.uploadUser(req.payload.profile_img, data?._id);
      await Users.findByIdAndUpdate(data?._id, {
        $set: { profile_img: `/assets/images/profile/${data?._id}.jpg` },
      });
    }

    return reply.redirect("/login?message=User successfully created!&alert=success");
  } catch (error) {
    console.log("SIGNUP_ERR", error);
    return reply.redirect("/login?message=Problem occured while creating user!&alert=error");
  }
};

internals.logout = function (req, reply) {
  req.cookieAuth.clear();
  return reply.redirect("/login");
};

internals.web_authentication = async function (req, reply) {
  console.log("WEB_AUTHENTICATION");
  let credentials = await Users.findOne({
    $and: [{ username: req.payload.email }, { password: Crypto.encrypt(req.payload.password) }],
  }).lean();

  console.log(credentials)
  if (!credentials) {
    return reply.redirect(`/login?message=Invalid email or password!&alert=error`);
  } else if (["pending", "declined"].includes(credentials?.farm?.status)) {
    return reply.redirect(`/login?message=This account is ${credentials?.farm?.status}&alert=error`);
  }
  // const settings = await Settings.findOne({}).lean();
  // credentials.position=credentials.scope;
  // credentials.company_name=settings.name;
  // credentials.type=settings.type;
  req.cookieAuth.set(credentials);
  return reply.redirect(`/${credentials.scope}/dashboard`);

};

internals.password_reset = async (req, reply) => {
  try {
    const { user, password } = req.payload;
    const encrypted = Crypto.encrypt(password);

    await Users.findByIdAndUpdate(user, { $set: { password: encrypted } });
    return reply.redirect("/?message=Password successfully reset&alert=success");
  } catch (error) {
    console.log("RESSEET", error);
  }
};

internals.account_recovery = async (req, reply) => {
  try {
    const { code } = req.params;
    const validCode = await Links.findOne({ code }).lean();

    if (validCode) {
      await Links.findOneAndRemove({ code });
    }

    return reply.view("accounts/account-recovery.html", {
      validCode: validCode ? true : false,
      user: validCode?.userID || null,
      message: req.query.message,
      alert: req.query.alert,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = internals;
