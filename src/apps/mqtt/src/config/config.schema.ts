import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  MQTT_PORT: Joi.number().port().default(1883),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_DIALECT: Joi.string().valid('postgres').default('postgres'),
}).unknown(true);
