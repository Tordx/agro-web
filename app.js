"use strict";
require("dotenv").config();
require("module-alias/register");

const HapiServer = require("./src/config/hapi");

HapiServer.start(function () {
  console.log("Server is running at : " + HapiServer.info.uri);
});

require("./src/database/mongodb");
