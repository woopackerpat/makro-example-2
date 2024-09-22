const Joi = require("joi");

exports.createAddressSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  email: Joi.string().email().required(),
  address: Joi.string(),
  subDistrict: Joi.string(),
  district: Joi.string(),
  province: Joi.string(),
  postal: Joi.string().pattern(/^[0-9]{5}$/),
  isMain: Joi.boolean().required(),
});


exports.updateAddressSchema = Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
    email: Joi.string().email().optional(),
    address: Joi.string().optional(),
    subDistrict: Joi.string().optional(),
    district: Joi.string().optional(),
    province: Joi.string().optional(),
    postal: Joi.string().pattern(/^[0-9]{5}$/).optional(),
    isMain: Joi.boolean().optional(),
  });