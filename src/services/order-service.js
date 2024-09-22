const prisma = require("../config/prisma");

exports.getMyOrderProduct = (productId, userId) => {
  return prisma.order_Product.findFirst({
    where: {
      productId,
      userId,
    },
  });
};

exports.getOrderProductById = (orderProductId) => {
  return prisma.order_Product.findFirst({
    where: {
      id: Number(orderProductId),
    },
    include: {
      order: true,
    },
  });
};

exports.getOrderById = (orderId) => {
  return prisma.order.findFirst({
    where: {
      id: Number(orderId),
    },
  });
};

exports.updateOrder = (orderId, data) => {
  return prisma.order.update({
    where: {
      id: Number(orderId),
    },
    data,
  });
};

exports.getMyCart = (userId) => {
  return prisma.order.findFirst({
    where: {
      userId,
      status: "CART",
    },
    include: {
      orderProducts: true,
    },
  });
};

exports.getMyOrders = (userId) => {
  return prisma.order.findMany({
    where: {
      userId,
      status: {
        not: "CART",
      },
    },
    include: {
      orderProducts: true,
    },
  });
};

exports.deleteOrderProduct = (orderProductId) => {
  console.log(orderProductId);
  return prisma.order_Product.delete({
    where: {
      id: orderProductId,
    },
  });
};
