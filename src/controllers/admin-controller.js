const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/product");
const prisma = require("../config/prisma");
const productService = require("../services/product-service");
const orderService = require("../services/order-service");

const fs = require("fs/promises");
const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("../utils/cloudinary");
const createError = require("../utils/createErrror");
const { ORDER_STATUS } = require("../constants/order");

exports.adminCreateProduct = async (req, res, next) => {
  try {
    const data = await createProductSchema.validateAsync(req.body);

    if (req.files.length === 0) {
      return createError(400, "At least 1 image to be upload");
    }

    // const imagePromiseArray = [];

    // for (let file of req.files) {
    //   const promiseUrl = cloudinary.uploader.upload(file.path);
    //   imagePromiseArray.push(promiseUrl);
    // }

    // const imageArray = await Promise.all(imagePromiseArray);

    const imageArray = await uploadToCloudinary(req.files);
    console.log(imageArray);

    // const newProduct = await prisma.product.create({
    //   data: {
    //     ...data,
    //     images: {
    //       createMany: {
    //         data: imageArray.map((el) => ({ url: el.url })),
    //       },
    //     },
    //   },
    //   include: {
    //     images: true,
    //   },
    // });

    const toCreateData = {
      ...data,
      images: {
        createMany: {
          data: imageArray.map((el) => ({ url: el.url, cid: el.public_id })),
        },
      },
    };

    const newProduct = await productService.createProduct(toCreateData);

    res.json({ product: newProduct });
  } catch (err) {
    next(err);
  } finally {
    const toDeletePromiseArray = req.files.map((file) => fs.unlink(file.path));
    await Promise.all(toDeletePromiseArray);
  }
};

exports.adminUpdateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (typeof req.body.toDelImagesId === "string") {
      req.body.toDelImagesId = JSON.parse(req.body.toDelImagesId);
    }

    const data = await updateProductSchema.validateAsync(req.body);

    const imageArray = await uploadToCloudinary(req.files);

    if (data.toDelImagesId && data.toDelImagesId.length > 0) {
      for (let toDelImageId of data.toDelImagesId) {
        const image = await productService.getProductImageById(toDelImageId);
        if (!image) {
          continue;
        }

        await productService.deleteProductImage(image.id);
        await removeFromCloudinary(image.cid);
      }

      delete data["toDelImagesId"];
    }

    const product = await productService.getProductById(productId);

    // const updatedProduct = await prisma.product.update({
    //   where: {
    //     id: product.id,
    //   },
    //   data: {
    //     ...data,
    //     images: {
    //       createMany: {
    //         data: imageArray.map((el) => ({ url: el.url, cid: el.public_id })),
    //       },
    //     },
    //   },
    //   include: {
    //     images: true,
    //   },
    // });

    const toUpdateData = {
      ...data,
      images: {
        createMany: {
          data: imageArray.map((el) => ({ url: el.url, cid: el.public_id })),
        },
      },
    };

    const updatedProduct = await productService.updateProduct(
      product.id,
      toUpdateData
    );

    res.json({ products: updatedProduct });
  } catch (err) {
    next(err);
  } finally {
    const toDeletePromiseArray = req.files.map((file) => fs.unlink(file.path));
    await Promise.all(toDeletePromiseArray);
  }
};

exports.adminDeleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return createError(400, "Product id to be provided");
    }

    const product = await productService.getProductById(productId);

    if (!product) {
      return createError(400, "Product not found");
    }

    await productService.deleteProduct(product.id);

    const toDelImagePromiseArray = [];

    for (let image of product.images) {
      const toDelPromise = removeFromCloudinary(image.cid);
      toDelImagePromiseArray.push(toDelPromise);
    }

    await Promise.all(toDelImagePromiseArray);

    res.json({ message: "Product is deleted" });
  } catch (err) {
    next(err);
  }
};

exports.adminUpdateOrderStatus = async (req, res, next) => {
  try {
    const { orderId, status } = req.params;

    if (!orderId) {
      return createError(400, "Order id to be provided");
    }

    if (!status) {
      return createError(400, "Status to be provided");
    }

    const values = Object.values(ORDER_STATUS);

    const statusUpperCase = status.toUpperCase();

    const isMatchValue = values.includes(statusUpperCase);

    if (!isMatchValue) {
      return createError(400, "Status value not match any");
    }

    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return createError(400, "Order not found");
    }

    const updatedOrder = await orderService.updateOrder(order.id, { status: statusUpperCase });

    res.json({ order: updatedOrder });
  } catch (err) {
    next(err);
  }
};
