const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");

router.get("/me", userController.getMe);
router.patch("/", userController.updateProfile);

router.get("/address/all", userController.getAllAddresses);
router.post("/address", userController.createAddress);
router.patch("/address/:addressId", userController.updateAddress);
router.delete("/address/:addressId", userController.deleteAddress);

module.exports = router;
