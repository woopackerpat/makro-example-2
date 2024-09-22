const prisma = require("../config/prisma");
const createError = require("../utils/createErrror");
const productService = require("../services/product-service");
const orderService = require("../services/order-service");

exports.getAllProducts = async (req, res, next) => {
  try {
    const { search, limit = 10, page = 1, order = "desc" } = req.query;

    const whereClause = {};

    if (search) {
      whereClause.name = { contains: search };
    }

    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      where: whereClause,
      take: parseInt(limit),
      skip: skip,
      orderBy: {
        createdAt: order,
      },
    });

    res.json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return createError(400, "Product id to be provided");
    }

    const product = await productService.getProductById(productId);

    if (!product) {
      return createError(400, "Product not found");
    }
    if (req.user) {
      const orderProduct = await orderService.getMyOrderProduct(
        product.id,
        req.user.id
      );

      if (!orderProduct) {
        return res.json({ product });
      }

      return res.json({ product, orderProduct });
    }

    res.json({ product });
  } catch (err) {
    next(err);
  }
};
