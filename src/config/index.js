const Joi = require('joi');

require('dotenv').config();

const envConstsSchema = Joi.object({
  NODE_ENV: Joi.string().allow(['development', 'production']).default('development'),
  PORT: Joi.number().default(3200),
  JWT_SECRET: Joi.string().required().description('JWT Secret is required to sign'),
  MONGO_DB: Joi.string().required()
}).unknown().required();

const {
  error,
  value: envConsts
} = Joi.validate(process.env, envConstsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  env: envConsts.NODE_ENV,
  port: envConsts.PORT,
  jwtSecret: envConsts.JWT_SECRET,
  mongoDb: envConsts.MONGO_DB
}

module.exports = config;