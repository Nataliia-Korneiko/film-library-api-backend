const Joi = require('joi');
const { httpCode } = require('../helpers/constants');

const schemaSignup = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).optional().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua', 'ru'] },
    })
    .required(),
  password: Joi.string().min(8).max(20).required(),
});

const schemaSignin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const validate = (schema, body, next) => {
  const { error } = schema.validate(body);
  if (error) {
    const [{ message }] = error.details;

    return next({
      status: httpCode.BAD_REQUEST,
      message: `Field: ${message.replace(/"/g, '')}`,
    });
  }
  next();
};

module.exports.validateSignup = (req, _res, next) => {
  return validate(schemaSignup, req.body, next);
};

module.exports.validateSignin = (req, _res, next) => {
  return validate(schemaSignin, req.body, next);
};
