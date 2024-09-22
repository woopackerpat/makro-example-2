const prisma = require("../config/prisma");

exports.getProductById = (productId) => {
  return prisma.product.findFirst({
    where: {
      id: Number(productId),
    },
    include: {
      images: true,
    },
  });
};

exports.createProduct = (data) => {
  return prisma.product.create({
    data,
    include: {
      images: true,
    },
  });
};

exports.updateProduct = (productId, toUpdateData) => {
  return prisma.product.update({
    where: {
      id: productId,
    },
    data: toUpdateData,
    include: {
      images: true,
    },
  });
};

exports.deleteProduct = (productId) => {
  return prisma.product.delete({
    where: {
      id: productId,
    },
  });
};

exports.getProductImageById = (imageId) => {
  return prisma.product_Image.findFirst({
    where: {
      id: imageId,
    },
  });
};

exports.deleteProductImage = (imageId) => {
  return prisma.product_Image.delete({
    where: {
      id: imageId,
    },
  });
};


