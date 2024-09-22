const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgetPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/confirm-register/:token");

module.exports = router;
