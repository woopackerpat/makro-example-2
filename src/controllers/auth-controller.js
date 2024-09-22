const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");
const createError = require("../utils/createErrror");
const { v4: uuidv4 } = require("uuid");
const userService = require("../services/user-service");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return createError(400, "Email and password are required");
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return createError(400, "Typeof email or password is invalid");
    }

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return createError(400, "Email or password is invalid");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return createError(400, "Email or password is invalid");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return createError(400, "Email and password are required");
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return createError(400, "Typeof email or password is invalid");
    }

    const isUserExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (isUserExist) {
      return createError(400, "Email already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userService.createUser({
      email,
      password: hashedPassword,
      memberId: uuidv4(),
    });

    res.json({ message: "register success" });
  } catch (err) {
    next(err);
  }
};

exports.forgetPassword = (req, res, next) => {
  try {
    res.json({ message: "Forget password" });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = (req, res, next) => {
  try {
    res.json({ message: "Reset password" });
  } catch (err) {
    next(err);
  }
};
