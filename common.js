const passport = require("passport");

exports.sanitize = (auth) => {
  return { id: auth.id, role: auth.role };
};

exports.isAuth = (req, res) => {
  return passport.authenticate("jwt");
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};
