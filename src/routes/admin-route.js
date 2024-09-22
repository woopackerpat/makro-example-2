const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const upload = require("../middlewares/upload");

router.post(
  "/product",
  upload.array("images", 5),
  adminController.adminCreateProduct
);
router.patch(
  "/product/:productId",
  upload.array("images", 5),
  adminController.adminUpdateProduct
);
router.delete("/product/:productId", adminController.adminDeleteProduct);

router.patch("/order/:orderId/status/:status", adminController.adminUpdateOrderStatus);

module.exports = router;
