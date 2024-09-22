const express = require("express");
const router = express.Router();
const productController = require("../controllers/product-controller");

router.get("/all", productController.getAllProducts);
router.get("/:productId", productController.getProduct);

module.exports = router;
