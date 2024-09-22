const createError = require("../utils/createErrror");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { removePassword } = require("../utils/removeProperties");
const userService = require("../services/user-service");

const optionalAuthenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer")) {
      return next();
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return next();
    }

    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userService.getUserById(jwtPayload.id);

    if (!user) {
      return next();
    }

    const removedPasswordUser = removePassword(user);

    req.user = removedPasswordUser;
    next();
  } catch (err) {
    next();
  }
};

module.exports = optionalAuthenticate;
