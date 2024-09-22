const prisma = require("../config/prisma");
const orderService = require("../services/order-service");
const productService = require("../services/product-service");
const createError = require("../utils/createErrror");
const { UPDATE_ORDER_TYPE } = require("../constants/order");

exports.getMyCart = async (req, res, next) => {
  try {
    const cart = await orderService.getMyCart(req.user.id);

    res.json({ cart });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);

    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

exports.addItemToCart = async (req, res, next) => {
  try {
    const { paymentMethod } = req.body;
    const { productId } = req.params;

    if (paymentMethod !== "CARD" && paymentMethod !== "PROMPTPAY") {
      return createError(400, "Payment method is not valid");
    }

    if (!productId) {
      return createError(400, "Product id to be provided");
    }

    const product = await productService.getProductById(productId);

    if (!product) {
      return createError(400, "Product not found");
    }

    const cart = await orderService.getMyCart(req.user.id);

    // if not order (cart) yet
    if (!cart) {
      await prisma.order.create({
        data: {
          total: product.price,
          paymentMethod,
          userId: req.user.id,
          orderProducts: {
            create: {
              productId: product.id,
              quantity: 1,
            },
          },
        },
      });
    } else {
      // check if item in cart already
      const isItemExistInCart = cart.orderProducts.find((el) => {
        return el.productId === product.id;
      });

      if (isItemExistInCart) {
        await prisma.order_Product.update({
          where: {
            id: isItemExistInCart.id,
          },
          data: {
            quantity: isItemExistInCart.quantity + 1,
          },
        });
      } else {
        await prisma.order.update({
          where: {
            id: cart.id,
          },
          data: {
            orderProducts: {
              create: {
                productId: product.id,
                quantity: 1,
              },
            },
          },
        });
      }
    }

    const updatedCart = await orderService.getMyCart(req.user.id);

    res.json({ cart: updatedCart });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderProduct = async (req, res, next) => {
  try {
    const { orderProductId, type } = req.params;

    if (
      type !== UPDATE_ORDER_TYPE.INCREASE &&
      type !== UPDATE_ORDER_TYPE.DECREASE
    ) {
      return createError(400, "Product type is invalid");
    }

    if (!orderProductId) {
      return createError(400, "Orderitem id to be provided");
    }

    const orderProduct = await orderService.getOrderProductById(orderProductId);

    if (!orderProduct) {
      return createError(400, "OrderProduct not found");
    }

    if (req.user.id !== orderProduct.order.userId) {
      return createError(403, "Forbidden");
    }
    // Check type of action
    if (type === UPDATE_ORDER_TYPE.INCREASE) {
      await prisma.order_Product.update({
        where: {
          id: orderProduct.id,
        },
        data: {
          quantity: {
            increment: 1,
          },
        },
      });
    } else if (type === UPDATE_ORDER_TYPE.DECREASE) {
      // Check if already 1 -> to remove it -> otherwise update quantity

      if (orderProduct.quantity === 1) {
        await prisma.order_Product.delete({
          where: {
            id: orderProduct.id,
          },
        });
      } else {
        await prisma.order_Product.update({
          where: {
            id: orderProduct.id,
          },
          data: {
            quantity: {
              decrement: 1,
            },
          },
        });
      }
    }

    const updatedCart = await orderService.getMyCart(req.user.id);

    res.json({ cart: updatedCart });
  } catch (err) {
    next(err);
  }
};

exports.deleteOrderProduct = async (req, res, next) => {
  try {
    const { orderProductId } = req.params;

    if (!orderProductId) {
      return createError(400, "Orderitem id to be provided");
    }

    const orderProduct = await orderService.getOrderProductById(orderProductId);

    if (!orderProduct) {
      return createError(400, "OrderProduct not found");
    }

    if (req.user.id !== orderProduct.order.userId) {
      return createError(403, "Forbidden");
    }

    await orderService.deleteOrderProduct(orderProduct.id);

    res.json({ message: "Deleted order product" });
  } catch (err) {
    next(err);
  }
};

exports.createOrderPayment = async (req, res, next) => {
  try {
    const cart = await orderService.getMyCart(req.user.id);

    const updatedOrder = await prisma.order.update({
      where: {
        id: cart.id,
      },
      data: {
        status: "PENDING",
      },
    });

    res.json({ order: updatedOrder });
  } catch (err) {
    next(err);
  }
};
