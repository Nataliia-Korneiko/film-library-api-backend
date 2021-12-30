const jwt = require('jsonwebtoken');
const { usersServices: services } = require('../services');
const { httpCode } = require('../helpers/constants');
require('dotenv').config();

const { JWT_SECRET_KEY } = process.env;

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await services.getUserByEmail(email);

    if (user) {
      return res.status(httpCode.CONFLICT).json({
        status: 'error',
        code: httpCode.CONFLICT,
        message: 'Provided email already exists',
      });
    }

    if (!email || !password) {
      return res.status(httpCode.BAD_REQUEST).json({
        status: 'error',
        code: httpCode.BAD_REQUEST,
        message: 'Required fields are missing',
      });
    }

    const newUser = await services.addUser({
      name,
      email,
      password,
    });

    const id = newUser._id;
    const payload = { id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '16h' });

    await services.updateToken(id, token);

    res.status(httpCode.CREATED).json({
      status: 'success',
      code: httpCode.CREATED,
      message: 'Successful operation',
      data: {
        user: {
          _id: newUser._id,
          name: newUser.name,
          // email: newUser.email,
          token,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await services.getUserByEmail(email);

    if (!user) {
      return res.status(httpCode.UNAUTHORIZED).json({
        status: 'error',
        code: httpCode.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }

    const isValidPassport = await user.validPassword(password);

    if (user.validPassword(password) === null || !isValidPassport) {
      return res.status(httpCode.UNAUTHORIZED).json({
        status: 'error',
        code: httpCode.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }

    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '16h' });

    await services.updateToken(id, token);

    res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      message: 'Successful operation',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          // email: user.email,
          films: user.films,
          token,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const userId = req.user._id;

  try {
    await services.updateToken(userId, null);

    res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.NO_CONTENT,
      message: 'Successful operation',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  logout,
};
