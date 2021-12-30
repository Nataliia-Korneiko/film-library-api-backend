const { Film } = require('../models');
const { User } = require('../models');

const getFilm = async (filmId) => {
  try {
    return Film.findById(filmId);
  } catch (error) {
    throw new Error(error.message);
  }
};

const addFilm = async (userId, body) => {
  try {
    const film = await Film.create(body);

    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          films: film._id,
        },
      },
      {
        new: true,
      }
    );
    return film;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteFilm = async (userId, filmId) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          films: filmId,
        },
      },
      {
        new: true,
      }
    );

    return Film.findByIdAndDelete(filmId);
  } catch (error) {
    throw new Error(error.message);
  }
};

const usersServices = {
  getFilm,
  addFilm,
  deleteFilm,
};

module.exports = usersServices;
