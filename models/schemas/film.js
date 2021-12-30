// const { Schema, SchemaTypes } = require('mongoose');
const { Schema } = require('mongoose');
const { filmStatus } = require('../../helpers/constants');

const filmSchema = new Schema(
  {
    apiFilmId: {
      type: Number,
      required: [true, 'Set id from api for film'],
    },
    status: {
      type: String,
      enum: {
        values: [filmStatus.WATCHED, filmStatus.QUEUED],
        message: "This status isn't allowed",
      },
      required: [true, 'Set status for film'],
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = filmSchema;
