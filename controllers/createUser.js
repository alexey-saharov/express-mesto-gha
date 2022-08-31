const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { CODE } = require('../utils/constants');
const { UserAlreadyExist } = require('../errors/userAlreadyExist');
const { ApplicationError } = require('../errors/applicationError');

const createUser = (req, res, next) => {
  const reqUser = {
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
    email: req.body.email,
    password: req.body.password,
  };

  User.findOne({ email: reqUser.email })
    .then((checkUser) => {
      if (checkUser) {
        throw new UserAlreadyExist();
      } else {
        bcrypt.hash(reqUser.password, 10)
          .then((hash) => User.create({ ...reqUser, password: hash })
            .then((user) => {
              const {
                name,
                about,
                avatar,
                email,
              } = user;
              res.status(CODE.SUCCESS_CREATED).send({
                name,
                about,
                avatar,
                email,
              });
            }));
      }
    })
    .catch((err) => {
      if (err.name === 'UserAlreadyExist') {
        next(err);
      } else if (err.code === 11000) {
        next(new ApplicationError(CODE.CONFLICT, err.message));
      } else if (err.name === 'CastError') {
        next(new ApplicationError(CODE.NOT_VALID_DATA, `CastError - ${err.message}`));
      } else if (err.name === 'ValidationError') {
        next(new ApplicationError(CODE.NOT_VALID_DATA, `Validation error - ${err.message}`));
      } else {
        next(new ApplicationError(CODE.SERVER_ERROR, `Internal server error - ${err.message}`));
      }
    });
};

module.exports = { createUser };
