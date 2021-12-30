const { filmsServices: services } = require('../services');
const { httpCode } = require('../helpers/constants');

const addFilm = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { apiFilmId, status } = req.body;

  try {
    if (!apiFilmId || !status) {
      return res.status(httpCode.BAD_REQUEST).json({
        status: 'error',
        code: httpCode.BAD_REQUEST,
        message: 'Invalid request body / Token not provided',
      });
    }

    const film = await services.addFilm(userId, {
      user: userId,
      apiFilmId,
      status,
    });

    res.status(httpCode.CREATED).json({
      status: 'success',
      code: httpCode.CREATED,
      message: 'Successful operation',
      data: {
        // user: userId,
        _id: film._id,
        apiFilmId: film.apiFilmId,
        status: film.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteFilm = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { filmId } = req.params;

  try {
    const film = await services.getFilm(filmId);

    if (!film) {
      return res.status(httpCode.BAD_REQUEST).json({
        status: 'fail',
        code: httpCode.BAD_REQUEST,
        message: 'Invalid request body / Token not provided',
      });
    }

    await services.deleteFilm(userId, filmId);

    res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      message: 'Successful operation',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFilm,
  deleteFilm,
};
