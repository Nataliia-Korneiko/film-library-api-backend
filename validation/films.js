const Joi = require('joi');
const { httpCode } = require('../helpers/constants');

const schemaAddFilm = Joi.object({
  apiFilmId: Joi.number().integer().required(),
  status: Joi.any().valid('watched', 'queued').required(),
});

const validate = (schema, body, next) => {
  const { error } = schema.validate(body);

  if (error) {
    const [{ message }] = error.details;

    return next({
      status: httpCode.BAD_REQUEST,
      message: `Field ${message.replace(/"/g, '')}`,
    });
  }
  next();
};

module.exports.validateAddFilm = (req, _res, next) => {
  return validate(schemaAddFilm, req.body, next);
};
