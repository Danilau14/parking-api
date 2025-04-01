import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PSQL_HOST: Joi.string().required(),
  PSQL_PORT: Joi.number().default(5432),
  PSQL_USERNAME: Joi.string().required(),
  PSQL_PASSWORD: Joi.string().required(),
  MAIL_HOST: Joi.string(),
  MAIL_PORT: Joi.number().default(1025),
  JWT_SECRET: Joi.string(),
  JWT_EXPIRE_IN: Joi.string(),
});
