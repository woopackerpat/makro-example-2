const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order-controller");

// Cart
router.get("/my-cart", orderController.getMyCart);
router.post("/product/:productId", orderController.addItemToCart);
router.patch(
  "/order-product/:orderProductId/type/:type",
  orderController.updateOrderProduct
);
router.delete(
  "/order-product/:orderProductId",
  orderController.deleteOrderProduct
);

// Order
router.patch("/:orderId", orderController.createOrderPayment); //Checkout
router.get("/all", orderController.getOrders);

module.exports = router;
