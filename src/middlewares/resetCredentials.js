const { Users, Settings } = require("@models");

module.exports = async (req, res) => {
  if (req.auth.isAuthenticated) {
    let credentials = await Users.findOne({ _id: req.auth.credentials._id }).lean();
    await req.cookieAuth.clear();
    await req.cookieAuth.set(credentials);
  }
};
