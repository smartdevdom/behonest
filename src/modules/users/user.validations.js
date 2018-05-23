const Joi = require('joi');


const userRegisterValidation = {
  body: {
    fullname: Joi.string().max(70).trim().required(),
    username: Joi.string().trim().required(),
    password: Joi.string().min(6).trim().required(),
    email: Joi.string().email().trim().required(),
    birthdate: Joi.string(),
    gender: Joi.string().allow(['male', 'female']).lowercase(),
    country: Joi.string(),
    photo: Joi.string(),
    role: Joi.string().default('USER_ROLE'),
    notifications: Joi.boolean().default(false),
  }
}

const userLoginValidation = {
  body: {
    username: Joi.string().trim().required(),
    password: Joi.string().min(6).trim().required()
  }
}

module.exports = {
  userRegisterValidation,
  userLoginValidation
}