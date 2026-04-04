import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3001),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_DIALECT: Joi.string().valid('postgres').default('postgres'),
  AUTH_SECRET: Joi.string().optional(),
  SECRET: Joi.string().optional(),
  AUTH_ALGORITHMS: Joi.string().default('HS256'),
}).unknown(true);
