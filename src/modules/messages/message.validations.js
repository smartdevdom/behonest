const Joi = require('joi');

const messageValidation = {
  body: {
    message: Joi.string().trim().required(),
    user: Joi.string().required(),
    favorite: Joi.boolean().default(false)
  }
}

module.exports = {
  messageValidation
}