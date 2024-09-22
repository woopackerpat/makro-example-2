const createError = require("../utils/createErrror");

const admin = (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      return createError(403, "Forbidden");
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = admin;
