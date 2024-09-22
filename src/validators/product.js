const Joi = require("joi");

exports.createProductSchema = Joi.object({
  categoryId: Joi.number().integer().required(),
  name: Joi.string().trim().required(),
  price: Joi.number().precision(2).required(),
  stock: Joi.number().integer().required(),
  detail: Joi.string().trim().allow("", null),
  length: Joi.number().integer().min(1).optional(),
  width: Joi.number().integer().min(1).optional(),
  height: Joi.number().integer().min(1).optional(),
  weight: Joi.number().integer().min(1).optional(),
});

exports.updateProductSchema = Joi.object({
  categoryId: Joi.number().integer().optional(),
  name: Joi.string().trim().optional(),
  price: Joi.number().precision(2).optional(),
  stock: Joi.number().integer().optional(),
  detail: Joi.string().trim().allow("", null).optional(),
  length: Joi.number().integer().min(1).optional(),
  width: Joi.number().integer().min(1).optional(),
  height: Joi.number().integer().min(1).optional(),
  weight: Joi.number().integer().min(1).optional(),
  toDelImagesId: Joi.array().items(Joi.number().integer()).optional(),
});
