const Joi = require("joi");

exports.updateUserSchema = Joi.object({
  firstName: Joi.string().allow(null, "").optional(),
  lastName: Joi.string().allow(null, "").optional(),
  password: Joi.string().min(8).optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .allow(null, "")
    .optional(),
});
