const _ = require("lodash");

function authorizeUser(allowedRoles) {
  return (req, res, next) => {
    const userRoles = _.get(req, "user.role", []);
    if (!_.intersection([userRoles], allowedRoles).length) {
      return res.status(403).json({ error: "You are not authorized" });
    }
    return next();
  };
}

module.exports = authorizeUser;