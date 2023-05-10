"use strict";
// our configurations
var Config = require("../config"),
  Sharp = require("sharp"),
  fs = require("fs"),
  _ = require("lodash");

exports.upload = function (file, img_name) {
  var base64Image = file;
  var storagelink = `src/assets/images/insurance/${img_name}.jpg`;
  Sharp(base64Image)
    .resize({
      width: 500,
      height: 500,
      fit: Sharp.fit.cover,
    })
    .toFile(storagelink)
    .then((data) => {
      console.log("IMAGE_UPLOAD_SUCCESS:", data);
      return data;
    })
    .catch((error) => {
      console.log("IMAGE_UPLOAD_ERROR: ", error);
      return new Error("Problem occured while uploading photo");
    });
};

exports.uploadUser = function (file, img_name) {
  var base64Image = file;
  var storagelink = `src/assets/images/profile/${img_name}.jpg`;
  Sharp(base64Image)
    .resize({
      width: 500,
      height: 500,
      fit: Sharp.fit.cover,
    })
    .toFile(storagelink)
    .then((data) => {
      console.log(data);
      return true;
    })
    .catch((error) => {
      console.log("ERROR: ", error);
      return false;
    });
};
exports.uploadLogo = function (file, img_name) {
  var base64Image = file;
  var storagelink = `src/assets/images/logo/${img_name}.jpg`;
  Sharp(base64Image)
    .resize({
      width: 500,
      height: 500,
      fit: Sharp.fit.cover,
    })
    .toFile(storagelink)
    .then((data) => {
      console.log(data);
      return true;
    })
    .catch((error) => {
      console.log("ERROR: ", error);
      return false;
    });
};
exports.remove = function (file) {
  var folderDirectory = __dirname.replace("lib", "");
  try {
    if (!_.isEmpty(file)) {
      fs.unlinkSync(folderDirectory + file);
    }
  } catch (err) {
    console.error(err);
  }
  return;
};
